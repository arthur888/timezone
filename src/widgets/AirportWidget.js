import React, {Component} from 'react';
import moment from 'moment-timezone';
import {Scrollbars} from 'react-custom-scrollbars';

export default class AirportWidget extends Component {
	constructor(props) {
		super(props);
		this.state = {
			city: '',
			airports: [],
			location: {}
		}
	}
	getAirports() {
		var lat = this.props.match.params.lat;
		var lng = this.props.match.params.lng;
		//var city = this.props.match.params.city;
		if(lat && lng) {
			fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng='+ lat + ',' + lng +'&sensor=false')
			.then( (r) => r.json() )
			.then( (j) => {
				if(j.status === 'OK') {
					
					if(j.results) {
						var a_city = '';
						var a_country = '';
						j.results[0].address_components.forEach( (c) => {
							if(c.types.indexOf('administrative_area_level_1') > -1) {
								a_city = c.long_name;
							}
							if(c.types.indexOf('country') > -1) {
								a_country = c.short_name;
							}
						} );
						fetch('https://maps.googleapis.com/maps/api/geocode/json?address=airport%20'+ encodeURIComponent(a_city +',' + a_country)  +'&sensor=false')
						.then( (r) => r.json() )
						.then( (k) => {
							if(k.status === 'OK') {
								var city = this.props.match.params.city || moment.tz.guess();
								city = city.split('/').pop();
								this.setState({airports: k.results.map( (airport) => {
									airport.address_components.forEach( (ac) => {
										if(ac.types.indexOf('airport') > -1) {
											airport.airport_name = ac.long_name;
										}
										if(ac.types.indexOf('country') > -1) {
											airport.airport_country = ac.long_name;
										}

									} );
									return airport;
								} ), city: city});
							}
						} );
					}

				}
			} );
		}
	}
	componentDidMount() {
		this.getAirports();
	}
	componentDidUpdate(p, n) {
		if(this.props.match.params.city !== p.match.params.city) {
			this.getAirports();
		}
	}
	render() {
		return (
			<div className="widget airport-widget">
				<div className="widget-title"><span className="caption">Airport</span></div>
				<div className="sub-title"><h2>{this.state.city} Airports:</h2></div>
				<div className="airports-list">
					<Scrollbars style={{height: '170px'}}>
					{this.state.airports.map( (airport, i) => {
						return (
							<div className="airport-single" key={i}>
								<div className="block-1"><h3>{airport.formatted_address} </h3></div>
								{/*<div className="block-2">{airport.airport_country}</div>*/}
							</div>
						);
					} )}
					</Scrollbars>
					{this.state.airports.length === 0 ? (
							<div className="airport-single" key={0}>
								<div className="block-1">No airports found</div>
								<div className="block-2"></div>
							</div>
						) : ''}
				</div>
			</div>
		);
	}
}