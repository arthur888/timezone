import React, { Component } from 'react';
import {Row, Col, Container} from 'reactstrap';

import Mapside from  '../components/Mapside';
import Rightside from '../components/Rightside';
import storage from '../libs/localstorage';
import {Link} from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import Advertisement from '../widgets/Advertisement';



import '../App-page-cities.css';
import logo from '../assets/logo/kevllar-logo-color-180.png';
import logo2x from '../assets/logo/kevllar-logo-color-180@2x.png';
import config from 'react-global-configuration';


import GetCity from '../libs/CityManager';
// Page layout
export default class CitiesPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			markers: this.getMarkers(),
			twilight: false,
			timezone: false,
			pins: true,
			autoDetected: {
				lat: 30,
				lon: 75
			}
		}
	}
	componentDidMount() {
		this.initAutodetect();
		   
		document.title = 'Timefinder – What time is it?';
		
	}
	initAutodetect() {
		fetch('http://ip-api.com/json')
			.then( r => r.json() )
			.then( (j) => {
				if(j.status === 'success') {
					this.setState({'autoDetected': j});
					if(storage.item.selected_cities.length === 0) {
						GetCity({city: j.city, location:{} }, j.country)
						.then( (city) => {
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
							this.setState({markers: this.getMarkers()});
						})
					}
				}
			});
	}
	setMode(mode) {
		this.setState({mode: mode});
	}
	getMarkers() {
		var markers = [];
		storage.item.selected_cities.forEach( (city) => {
			markers.push({lat: city.location.lat, lng: city.location.lng, text: city.city, tz: city.timezone, country: city.country});
		} );
		return markers;
	}
	updateMarkers(){
		this.setState({
			markers_updated: Date.now(),
			markers: this.getMarkers()
		});
	}
    render() {
	  	return (
	  	<div className="full-height">
	      <Container fluid={true} className="shadowed-header">
	      	<Row>
	      		<Col>
	  				<div className="page-header">
	          			<div className="title">
	          				<Link to="/">
	          					<img alt="logo" src={logo} srcSet={logo + ' 1x,'+ logo2x + ' 2x'} />
	          				</Link>
	          			</div>
	          			<div className="header-ad">
	          				<Advertisement adurl={config.get('ad_url_header')}/>
	          			</div>
	          		</div>  	
	          		
	      		</Col>
	      	</Row>
	      </Container>
	      <div className="side-by-side-map">
	      	<div className="map-side">
	      		<div className="map-options">
					<button onClick={() => this.setState({'twilight': !this.state.twilight})} className={this.state.twilight === true ? 'active' : ''}><FontAwesome name="moon-o"/> <span>Day / Night</span></button>
					<button onClick={() => this.setState({'timezone': !this.state.timezone})} className={this.state.timezone === true ? 'active' : ''}><FontAwesome name="clock-o"/> <span>Time Zone</span></button>
					<button onClick={() => this.setState({'pins': !this.state.pins})} className={this.state.pins === true ? 'active' : ''}><FontAwesome name="map-marker"/> <span>Locations</span></button>
				</div>
		      	{/** Mapside component is used here **/}	
				<Mapside autoDetected={this.state.autoDetected} timezone={this.state.timezone} twilight={this.state.twilight} pins={this.state.pins} lat='20' lng='0' zoom='2' markers={this.state.markers}/>	
			</div>
			
			{/* Rightside component is used */}
			<Rightside updateMarkers={this.updateMarkers.bind(this)} />
			</div>
	    </div>  
	    );
	}
}
