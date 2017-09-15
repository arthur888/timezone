import React, {Component} from 'react';
import config from 'react-global-configuration';
import GetCity from '../libs/CityManager';
import FontAwesome from 'react-fontawesome';
import storage from '../libs/localstorage';
import { Scrollbars } from 'react-custom-scrollbars';
import {Redirect} from 'react-router-dom';
import {UncontrolledTooltip} from 'reactstrap';

export default class SearchResults extends Component {
	constructor(props) {
		super(props);
		this.pendingRequest = null;
		this.state = {
			cities: [],
			redirectUrl: false
		}
	}
	componentDidMount() {
		this.findResults(this.props.keywords);
	}
	componentDidUpdate(p) {
		if(p.keywords !== this.props.keywords) {
			this.findResults(this.props.keywords);
		}
		
	}
	findResults(keywords) {
		var cities = [];
		clearTimeout(this.pendingRequest);
		this.pendingRequest = setTimeout( () => {
			this.props.setIsSearching(true);
			fetch(config.get('server_url') + '/time/search_cities?limit=20&q=' + encodeURIComponent(keywords))
			.then( (r) => r.json() )
			.then( (j) => {
				this.props.setIsSearching(false);
				for(let i in j.cities) {
					GetCity(j.cities[i], j.cities[i].country)
						.then( (city) => {
							cities.push(city)
							this.setState({cities: cities});
						} );
				}
			} )
			.catch( () => {
				this.props.setIsSearching(false);
			} );
		}, 500);
		
	}
	addCity(city) {
		var object = {
			city: city.city,
			country: city.country,
			offset: city.timezone.rawOffset / 60,
			timezone: city.timezone.timeZoneId,
			place_id: city.location.results[0].place_id,
			location: {
				"lat":city.location.results[0].geometry.location.lat,
				"lng":city.location.results[0].geometry.location.lng
			}
		}
		storage.item.selected_cities.push(object);
		storage.store();
		this.setState({updated: true});
		this.props.updateMarkers();
		this.props.setSearchMode(false);
	}
	removeCity(city) {
		for(let i in storage.item.selected_cities) {
			let current = storage.item.selected_cities[i];
			if(current.city === city.city 
				&& current.offset === city.timezone.rawOffset/60 
				&& current.location.lat ===  city.location.results[0].geometry.location.lat
				&& current.location.lng ===  city.location.results[0].geometry.location.lng
			) {
				storage.item.selected_cities.splice(i, 1);
				storage.store();
				break;
			}
		}
		this.setState({updated: true});
		this.props.updateMarkers();
		this.props.setSearchMode(false);
	}
	hasCity(city) {
		var classlist = 'city-single';
		storage.item.selected_cities.map( (c) => {
			if(c.city === city.city
				&& c.location.lat ===  city.location.results[0].geometry.location.lat
				&& c.location.lng ===  city.location.results[0].geometry.location.lng
				) {
				classlist += ' active';
			}
			return c;
		} )
		return classlist;
	}
	render() {
		if(this.state.redirectUrl) {
			return (<Redirect to={this.state.redirectUrl} />);
		}
		return (<div>
			{/*<div className="return-back" onClick={() => {this.props.setSearchMode(false)}}>
				<FontAwesome name="arrow-left" /> <div className="label-return">Return</div>
			</div>*/}
			<Scrollbars className="city-search-results" style={{height: 'calc(100vh - 123px)'}}>
				{this.state.cities.map( (city, i) => {
					var url = '/timezone/' + city.city + '/' + city.location.results["0"].geometry.location.lat + '/' + city.location.results["0"].geometry.location.lng + '/' + city.timezone.timeZoneId;
					return (<div key={i} className={this.hasCity(city)}>
						<div className="city-name" onClick={ () => {
							this.setState({redirectUrl: url});
						} } style={{cursor: 'pointer'}}>{city.city}, {city.country}</div>
						<div className="actions">
							<FontAwesome onClick={this.addCity.bind(this, city)} id={'tooltip-for-plus-' + i} name="plus-circle add" />
							<FontAwesome onClick={this.removeCity.bind(this, city)} id={'tooltip-for-minus-' + i} name="minus-circle remove" />

							<UncontrolledTooltip placement="left"  target={'tooltip-for-plus-' + i}>
					          Add to map
					        </UncontrolledTooltip>
					        <UncontrolledTooltip placement="left" target={'tooltip-for-minus-' + i}>
					          Remove from map
					        </UncontrolledTooltip>
						</div>
					</div>)
				} )}
			</Scrollbars>
		</div>);
	}
}