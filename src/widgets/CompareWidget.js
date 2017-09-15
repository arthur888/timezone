import React, {Component} from 'react';
import moment from 'moment-timezone';
import FontAwesome from 'react-fontawesome';
import config from 'react-global-configuration';
import GetCity from '../libs/CityManager';

import preloader from '../assets/tf-preloader.gif';

export default class CompareWidget extends Component {
	constructor(props) {
		super(props);
		this.state = {
			location1_tz: this.props.match.params.tz,
			location1_name: this.props.match.params.city + ', ' + this.props.country,
			location2_tz: moment.tz.guess(),
			location2_name: 'Current Location',
			diff: 0
		}
	}
	getDiff() {
		var location1 = moment().tz(this.state.location1_tz).utcOffset();
		var location2 = moment().tz(this.state.location2_tz).utcOffset();
		var diff = location2 - location1;
		//this.setState({diff: diff});
		return diff;
	}
	componentDidUpdate(p) {
		if(this.props.country !== p.country || this.props.match.params.city !== p.match.params.city) {
			this.setState({
				location1_name: this.props.match.params.city + ', ' + this.props.country,
				location1_tz: this.props.match.params.tz
			});
		}
	}
	getCompareLine() {
		if(this.state.location2_name === '') {
			return 'Choose location to compare with:';	
		}
		var diff = this.getDiff();
		var behind_forwards = '';
		var hours_count = diff;
		if(diff < -1) {
			hours_count *= -1;
			behind_forwards = 'ahead';
		} else {
			behind_forwards = 'behind';
		}
		hours_count /= 60;

		if(hours_count === 0) {
			return (<div>{this.state.location1_name} is <span className="hours-count">same as</span> {this.state.location2_name}</div>);
		}

		return (<div>{this.state.location1_name} is <span className="hours-count">{hours_count} hours</span> {behind_forwards}  {this.state.location2_name}</div>);
	}
	componentDidMount() {
		this.getDiff();
	}
	selectedLocation1(city) {
		this.setState({
			location1_tz: city.timezone.timeZoneId,
			location1_name: city.city + ', ' + city.country
		});
	}
	selectedLocation2(city) {
		this.setState({
			location2_tz: city.timezone.timeZoneId,
			location2_name: city.city + ', ' + city.country
		});
	}
	render() {
		return (
			<div className="widget compare-widget">
				<div className="widget-title"><span className="caption"><h2>Compare</h2></span></div>
				<div className="short-title"><h3>{this.getCompareLine()}</h3></div>
				
				<div className="form-group">
					<label>Location:</label>
					<GoogleSearch default={this.props.match.params.city + ', ' + this.props.country} onSelected={this.selectedLocation1.bind(this)}/>
				</div>
				<div className="form-group">
					<label>Compare with:</label>
					<GoogleSearch onSelected={this.selectedLocation2.bind(this)}/>
				</div>
				<div className="form-group text-right">
					<button type="button" className="btn btn-xs compare-btn"><FontAwesome name="info-circle"/> Compare</button>
				</div>
			</div>
		);
	}
}

class GoogleSearch extends Component {
	constructor(props) {
		super(props);
		this.previousRequest = null;
		this.state = {
			isSearching: false,
			displayResults: false,
			results: []
		}
	}
	componentDidMount() {
		if(this.props.default) {
			this.textInput.value = this.props.default;	
		}
	}
	componentDidUpdate(p) {
		if(this.props.default !== p.default) {
			this.textInput.value = this.props.default;
		}
	}
	doSearch(){
		var q = this.textInput.value.toString();
		if(q === '') {
			this.setState({displayResults: false, isSearching: false});
			return false;
		}
		this.setState({isSearching: true, displayResults: false});
		var baseUrl = config.get('server_url') + '/time/search_cities?q=' + encodeURIComponent(q) + '&limit=10';
		fetch(baseUrl + '&input=' + encodeURIComponent(q))
		.then((r) => r.json())
		.then((j) => {
			var promises = [];
			if(j.cities.length > 0) {
				j.cities.forEach( (city) => {
					promises.push(
						GetCity(city, city.country, true)
					)
				} )
			}
			Promise.all(promises).then((d)=> {
				var results = [];
				d.forEach( (a) => {
					if(a.timezone.timeZoneId) {
						results.push(a);
					}
				} );
				this.setState({isSearching: false, displayResults: true, results: results});
			});
		}).catch((e) => {
			this.setState({isSearching:false, displayResults:true, results: []});
		})
	}
	changeText(e) {
		clearTimeout(this.previousRequest);
		this.previousRequest = setTimeout( () => {
			this.doSearch();
		}, 500);
	}
	onChoose(place) {
		this.props.onSelected(place);
		this.textInput.value = place.city + ', ' + place.country;
	}
	render() {
		return (
			<div className="loading-input b-google-search" onBlur={ () => {  setTimeout( () => {this.setState({displayResults: false})}, 200 )   } }>
				<input type="text" ref={ (input) => {this.textInput = input} } 
					onKeyUp={this.changeText.bind(this)} 
					className="form-control"/>
				{this.state.isSearching ? (<img className="preloader" src={preloader} alt=""/>) : ''}
				{this.state.displayResults ? <GoogleSearchResults onChoose={this.onChoose.bind(this)} results={this.state.results}/> : ''}
			</div>
		);
	}
}

class GoogleSearchResults extends Component {
	render() {
		return (
			<div className="b-results-container">
				{this.props.results.length === 0 ? <div className="no-results">No results</div> : ''}
				{this.props.results.map( (item, k) => {
					return <GoogleSearchResultsItem item={item} key={k} onChoose={this.props.onChoose.bind(this)} />
				} )}
			</div>
		);
	}
}

class GoogleSearchResultsItem extends Component {
	render() {
		return (
			<div className="b-item" onClick={ ()=>{ this.props.onChoose(this.props.item) } }>
				<div className="city-name">{this.props.item.city}, {this.props.item.country}</div>
				<div className="time">{moment().tz(this.props.item.timezone.timeZoneId).format('h:mmA')}</div>
			</div>
		);
	}
}