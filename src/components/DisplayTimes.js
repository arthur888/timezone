import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import moment from 'moment';
import {Link} from 'react-router-dom';
import config from 'react-global-configuration';
import storage from '../libs/localstorage';
import {Scrollbars} from 'react-custom-scrollbars';

import icon_sun from '../assets/images/weather/svg/004-sun.svg';
import Weather from '../libs/Weather';

export default class DisplayTimes extends Component {
	constructor(props) {
		super(props);
		this.state = {
			times: storage.item.selected_cities
		}
	}
	render() {
		return (
			<Scrollbars className="times-list" style={{ height: 'calc(100vh - 80px)' }}>
				{this.state.times.map( (city, i) => {
					return (
						<CityTime updateMarkers={this.props.updateMarkers} onupdate={this.props.onupdate} key={i} city={city} />
					);
				} )}
				<div className="add-more" onClick={ () => {this.props.setSearchMode(true)} }><FontAwesome name="plus"/></div>
			</Scrollbars>
		);
	}
}

class CityTime extends Component {
	constructor(props) {
		super(props);
		this.state = {
			interval: 0,
			update: false,
			weather: null
		};
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
	componentWillUnmount() {
		clearInterval(this.state.interval);
	}
	componentDidMount() {
		var interval = setInterval( () => this.setState({update: true}) , 1000);
		this.setState({interval: interval});
		var w = new Weather();
		w.get(this.props.city.location).then( (weather) => { 
			this.setState({weather: weather});
		} );
	}
	removeWidget() {
		//eslint-disable-next-line
		if(confirm('Really remove this city?')) {
			storage.remove_city(this.props.city.place_id);
			this.props.onupdate('');
			this.props.updateMarkers();
		}
	}
	render() {
		var time = moment().tz(this.props.city.timezone);
		var city = this.props.city;
		var w = this.state.weather;
		var link = '/timezone/' + city.city + '/' + city.location.lat + '/' + city.location.lng + '/' + city.timezone;
		
		var diff = parseInt((time._offset - moment().tz(moment.tz.guess())._offset) / 60, 10);
		var diffwords = 'ahead';
		if(diff < 0) {
			diff *= -1;
			diffwords = 'behind';
		}
		var daydiff = 'TODAY';
		if(moment(time.format('YYYY-MM-DD')).isAfter(moment().format('YYYY-MM-DD'), 'day')) {
			daydiff = '+1 day';
		} else if(moment(time.format('YYYY-MM-DD')).isBefore(moment().format('YYYY-MM-DD'), 'day')) {
			daydiff = '-1 day';
		}
		return (
			<div className="widget-city-time">
				<div className="heading">
					<div className="difference">{diff} hrs {diffwords}</div>
					<div className="day-diff">{daydiff}</div>
					<FontAwesome name="times" className="close" onClick={this.removeWidget.bind(this)} />
				</div>
				<div className="city-name">{this.props.city.city}, {this.props.city.country}</div>
				<div className="time-block">
					<div className="time">{time.format('hh:mm')}</div>
					<div className="timezone-info">
						<div className="timezone">{time.format('z')}</div>
						<div className="am-pm">{time.format('A')}</div>
					</div>
				</div>
				<div className="time-info">
					<div className="time-details">
						<div className="dayname">{time.format('dddd')}</div>
						<div className="full-date">{time.format('MMMM DD, YYYY')}</div>
					</div>
					<div className="weather-icon">
						{w ?
						(<img src={w.list[0].weather[0].icon_url} alt="{w.list[0].weather[0].description}" />) :
						(<img src={icon_sun} alt="sunny" />) 
						}
					</div>
				</div>
				<div className="more-links">
					<Link to={link} className="more-info"><FontAwesome name="info-circle"/> More Info</Link>
				</div>
			</div>
		);
	}
}