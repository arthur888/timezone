import React, {Component} from 'react';
import moment from 'moment-timezone';
import Weather from '../libs/Weather';
import FontAwesome from 'react-fontawesome';

export default class WeatherWidget extends Component {
	constructor(props) {
		super(props);
		var lat = props.match.params.lat;
		var lng = props.match.params.lng;
		var location = null;
		if(lat && lng) {
			location = {
				lat: lat,
				lng: lng
			}
		} else {
			location = moment.tz.guess().split('/').pop()
		}
		this.weather = null;
		this.state = {
			location: location,
			units: 'metric'
		}
	}
	componentDidMount(){
		this.getWeather(this.state.units);
	}
	componentDidUpdate(p) {
		if(this.getLocation().lat !== this.state.location.lat) {
			this.weather = null;
			this.getWeather(this.state.units);
		}
		if(this.props.country !== p.country) {
			fetch('http://api.population.io/1.0/population/'+ moment().format('YYYY') +'/'+ this.props.country +'/')
			.then((r)=> r.json())
			.then( (j) => {
				var total = 0;
				if(j && !j.detail) {
					j.forEach( (e)=>{
						total += e.total;
					} );
					this.props.setPopulation(total);
				} else {
					this.props.setPopulation(0);
				}
			});
		}
	}
	getLocation() {
		var lat = this.props.match.params.lat;
		var lng = this.props.match.params.lng;
		var location = null;
		if(lat && lng) {
			location = {
				lat: lat,
				lng: lng
			}
		} else {
			location = moment.tz.guess().split('/').pop()
		}
		return location;
	}
	getWeather() {
		var w = new Weather();
		var location = this.getLocation();
		w.get(location, 'metric').then( (j) => {
			this.weather = j;
			this.setState({location: location});
		} );
	}
	changeUnits(type) {
		this.setState({'units': type});
	}
	convertUnit(value) {
		if(this.state.units === 'imperal') {
			return (value * (9/5)) + 32;
		} else {
			return value;
		}
	}
	getSymbol() {	
		return this.state.units === 'imperal' ? (<span>&deg;F</span>) : (<span>&deg;C</span>);
	}
	render() {
		if(!this.weather) {
			return (
				<div className="widget weather-widget">
					<div className="widget-title"><span className="caption"><h2>Weather</h2></span></div>
					<div className="text-center">
						
					</div>
				</div>
			);
		}
		var w = this.weather;
		return (
			<div className="widget weather-widget" onClick={ () => {
				if(this.state.units === 'metric') {
					this.changeUnits('imperal');
				} else {
					this.changeUnits('metric');
				}
			} }>
				<div className="widget-title">
					<div className="actions">Unit:&nbsp;
						<div className="switch">
							<span onClick={this.changeUnits.bind(this, 'metric')} className={(this.state.units === 'metric')?'active':'normal'}>C</span>&nbsp;
							<span onClick={this.changeUnits.bind(this, 'imperal')} className={(this.state.units === 'imperal')?'active':'normal'}>F</span> 
						</div>
					</div> 
					<span className="caption"><h3>Weather</h3></span></div>
				<div className="weather-header">
					<div className="weather-icon">
						<img alt={w.list[0].weather[0].main} src={w.list[0].weather[0].icon_url} />
					</div>
					<div className="weather-info">
						<div className="current">{this.convertUnit(w.list[0].temp.day).toFixed(0)}{this.getSymbol()}</div>
						<div className="range">
							<span style={{'marginRight': '4px', 'opacity': '0.6'}}><FontAwesome name="long-arrow-up" /></span>
							{this.convertUnit(w.list[0].temp.min).toFixed(0)}{this.getSymbol()} 
							 &nbsp;| {this.convertUnit(w.list[0].temp.max).toFixed(0)}{this.getSymbol()}
							<span style={{'marginLeft': '4px', 'opacity': '0.6'}}><FontAwesome name="long-arrow-down" /></span>
						</div>
					</div>
				</div>
				<div className="weather-short-info">Weather in {w.city.name}, {w.city.country}:<br/>{w.list[0].weather[0].description}</div>
				<div className="forecast">
					{w.list.map( (day, i) => {
						if(i === 0) {
							return false;
						}
						return (
							<div key={i} className="forcast-day-single">
								<div className="day-name">{moment(day.dt * 1000).format('ddd')}</div>
								<div className="day-icon"><img alt={day.weather[0].main} src={day.weather[0].icon_url} /></div>
								<div className="temperature">{this.convertUnit(day.temp.day).toFixed(0)}{this.getSymbol()}</div>
							</div>
						);
					} )}
				</div>
			</div>
		);
	}
}