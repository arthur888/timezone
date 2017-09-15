import React, { Component } from 'react';
import moment from 'moment-timezone';
import config from 'react-global-configuration';

export default class ClockLarge extends Component {
	constructor(props) {
		super(props);
		this.state = {
			interval: 0,
			time: moment(),
			country: ''
		}
	}
	componentWillMount() {
		if(!moment.is_updated) {
			fetch(config.get('server_url') + '/time/current')
				.then( (r) => r.json() )
				.then( (d) => {
					var actual = d.timestamp;
					var diff = moment().tz('UTC').diff(moment(actual));
					moment.now = function(){
						moment.is_updated = true;
						return Date.now() - diff;
					}
				} );
		}
	}
	tick() {
		this.setState({'time': moment() });
	}
	componentDidMount() {
		var interval = setInterval(this.tick.bind(this), 1000);
		this.setState({interval: interval});
		this.getCountry();
	}
	componentDidUpdate(p) {
		if(p.match.params.lat !== this.props.match.params.lat){
			this.setState({country: ''})
			this.getCountry();
		}
	}
	getCountry() {
		fetch('https://maps.googleapis.com/maps/api/geocode/json?key='+ config.get('google_key') +'&latlng=' + this.props.match.params.lat + ',' + this.props.match.params.lng)
		//fetch(config.get('server_url') + '/time/search_cities?limit=1&lat=' + this.props.match.params.lat +'&lng=' + this.props.match.params.lng)
			.then( (r) => r.json() )
			.then( (j) => {
				if(j.status === "OK") {
					var country = '';
					j.results[0].address_components.forEach( (i) => {
						if(i.types.indexOf('country') > -1) {
							country = i.long_name;
						}
					});
					this.props.setCountry(country);
					this.setState({'country': country})
				}
				/*if(j.cities.length > 0) {
					this.props.setCountry(j.cities[0].country);
					this.setState({'country': j.cities[0].country})
				}*/
			} );
	}
	componentWillUnmount() {
		clearInterval(this.state.interval);
	}
	render() {
		var props = this.props;
		var tz = props.tz || props.match.params.tz;
		tz = (tz) ? tz : moment.tz.guess();
		var time = moment().tz(tz);
		var city = this.props.match.params.city;
		if(!city) {
			city = this.state.tz.split('/').pop()
		}
		var country = this.state.country;
		if(country) {
			country = '(' + country + ')';
		}
		return (
			<div className="widget-main-time">
      			<div className="time-info">
	      			<div className="timezone">
	      				{time.format('z')}/UTC{time.format('Z')}
	      			</div>
	      			<div className="time">
	      				{time.format('hh:mm:ss')}
	      			</div>
	      			<div className="city-name">
	      				{city} {country} 
	      			</div>
      			</div>
      			<div className="am-pm">
      				<span>{time.format('A')}</span>
      			</div>
  			</div>
		);
	}
}