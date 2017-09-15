import React, {Component} from 'react';
import {Container, Row, Col} from 'reactstrap';
import config from 'react-global-configuration';
import GetCity from '../libs/CityManager';
//import {Link} from 'react-router-dom';
import FontAwesome from 'react-fontawesome';

export default class WhatTimeWidget extends Component {
	constructor(props) {
		super(props);
		this.timeout = null;
		this.input = null;
		this.mounted = false;
		this.state = {
			cities: [],
			textblock: ''
		}
		this.searchCities('');
	}
	searchCities(string){
		var cities = [];
		var sq = encodeURIComponent(string);
		if(sq.length === 0) {
			sq = 'none';
		}
		var requests = [];
		fetch(config.get('server_url') + '/time/search_cities?limit=12&q=' + sq)
			.then( (r) => r.json() )
			.then( (j) => {
				for(let city in j.cities) {
					requests.push(GetCity(j.cities[city], j.cities[city].country));
				}
				Promise.all(requests).then( (data) => {
					for (let i in data) {
						if(this.mounted) {
							cities.push(data[i]);
							this.setState({cities: cities});
						}
					}
				} );
			} );
	}
	componentDidMount() {
		this.mounted = true;
		setInterval(() => {
			this.setState({textblock: window.textblock});
		}, 1000);
	}
	componentWillUnmount() {
		this.mounted = false;
	}
	getCities() {
		clearTimeout(this.timeout);
		this.timeout = setTimeout(() => {
			this.searchCities(this.input.value);
		}, 500);
	}
	render() {
		//var txtblock = this.state.textblock;
		
		return (<div className="what-time-block">
			<Container>
			
				<Row>
					<Col xs="12">
						<div className="title">What time is it in <input ref={ (inp) => {this.input = inp;} } type="text" onKeyUp={this.getCities.bind(this)}/> ?</div>
					
					</Col>
					
				</Row>
				{this.state.cities.length === 0 ? (<div style={{color:'#444', textAlign: 'center', marginTop: '30px', marginBottom: '100px'}}><FontAwesome name="circle-o-notch fa-spin"/> Loading</div>) : ''}	
				
				<div className="city-list">
					{this.state.cities.map( (city, i) => {
						let lat = city.location.results[0].geometry.location.lat;
						let lng = city.location.results[0].geometry.location.lng;
						let link = '/timezone/' + city.city + '/' + lat + '/' + lng + '/' + city.timezone.timeZoneId;
						return (<a key={i} className="city-name" href={link}>What time is it in <span>{city.city}</span></a>);
					} )}
				</div>
				
			</Container>
		</div>);
	}
}