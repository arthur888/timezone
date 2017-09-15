import React, {Component} from 'react';
//import moment from 'moment-timezone';
import config from 'react-global-configuration';
//import {Link} from 'react-router-dom';
import GetCity from '../libs/CityManager';
import FontAwesome from 'react-fontawesome';

export default class CountryCitiesWidget extends Component {
	constructor(props) {
		super(props);
		this.country = null;
		this.mounted = false;
		this.state = {
			cities: []
		}
	}
	getCities() {
		fetch(config.get('server_url') + '/time/cities?country=' + this.props.country + '&limit=10')
			.then( (r) => r.json() )
			.then( (j) => {
				if(!j.cities) {
					return;
				}
				this.country = j.country;
				var cities = [];
				var requests = [];
				for(let i = 0; i < j.cities.length; i++) {
					if(Object.keys(j.cities[i].location).length === 0){
						console.log('non cached');
						requests.push(GetCity(j.cities[i], j.country, true));
					} else {
						console.log('cached');
						cities.push({ city: j.cities[i].city, geocode: j.cities[i].location, tz: j.cities[i].timezone });
					}				
				}
				Promise.all(requests).then( (data) => {
					for(let i in data) {
						let city = data[i];
						if(city.location && city.location.results) {
							cities.push({ city: city.city, geocode: city.location, tz: city.timezone});
						}
					}
					if(this.mounted) {
						this.setState({ cities: cities });
					}
				});
				/*.then( (data) => {
									//cities.push({ city: data.city, geocode: data.location, tz: data.timezone});
									if(this.mounted) {
										this.setState({ cities: cities });
									}
								} );*/
			} );
	}
	componentDidMount() {
		this.getCities();
		this.mounted = true;
	}
	componentWillUnmount() {
		this.mounted = false;
	}
	componentDidUpdate(p) {
		if(p.match.params.city !== this.props.match.params.city || p.country !== this.props.country) {
			this.getCities();
		}
	}
	render() {
		return (
			<div className="country-cities-widget">
				<div className="title"><h2>Cities in {this.props.country}</h2></div>
				{this.state.cities.map( (city, i) => {
					var location = city.geocode.results[0].geometry.location;
					var link = '/timezone/' + city.city + '/' + location.lat + '/' + location.lng + '/' + city.tz.timeZoneId;
					return (<a key={i} href={link} style={{fontSize: Math.max(14, Math.random() * 45) + 'px'}} className="country-city-single">
						{city.city}
					</a>)
				} )}
				{this.state.cities.length === 0 ? (<div style={{color:'#fff'}}><FontAwesome name="circle-o-notch fa-spin"/> Loading</div>) : ''}
			</div>
		);
	}
}