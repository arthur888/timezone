import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {Container, Row, Col} from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import {Link} from 'react-router-dom';

// Include custom widget codes
import ClockLarge from '../widgets/ClockLarge';
import ScrollingCities from '../widgets/ScrollingCities';
import WeatherWidget from '../widgets/WeatherWidget';
import SunTimesWidget from '../widgets/SunTimesWidget';
import DaylightWidget from '../widgets/DaylightWidget';
import MoonTimesWidget from '../widgets/MoonTimesWidget';
import CompareWidget from '../widgets/CompareWidget';
import AirportWidget from '../widgets/AirportWidget';
import CountryCitiesWidget from '../widgets/CountryCitiesWidget';
import Advertisement from '../widgets/Advertisement';
import WhatTimeWidget from '../widgets/WhatTimeWidget';
import MapThisWidget from '../widgets/MapThisWidget';

import logo from '../assets/logo/kevllar-logo-color-180.png';
import logo2x from '../assets/logo/kevllar-logo-color-180@2x.png';
import bg from '../assets/symbols-bg-photo.jpg';

import config from 'react-global-configuration';

import localstorage from '../libs/localstorage';

export default class DetailPage extends Component {
    constructor(props) {
      super(props);
      this.bgImage = '';
      this.bgImageLoading = false;
      this.state = {
        last_updated: Date.now(),
        city_removed: false,
        removed_city: null,
        population: 0,
        country: '',
        hideclass:'hideme'
      }
    }
    componentDidMount() {
      document.title = 'What time is it in ' + this.props.match.params.city + ' – Time and Weather';

                        
      document.getElementById('backgroundtop').style.height = parseFloat(window.innerHeight)-100;
    }
    componentDidUpdate() {
      document.title = 'What time is it in ' + this.props.match.params.city + ', '+ this.state.country +' – Time and Weather';      
         

    }
    componentWillUpdate(n) {
      if(this.props.match.params.city !== n.match.params.city) {
        this.setState({last_updated: Date.now()})
      }

    	
         if(window.textblock !=='')
         {
                document.getElementById('textblock').style.display='block';	
         }
         else
         {
         	  document.getElementById('textblock').style.display='none';
         }
    }
    setPopulation(population) {
      this.setState({population: population});
    }
    setCountry(country) {
      this.setState({country: country});
    }
    removeCity(city) {
      if(localstorage.item.selected_cities.indexOf(city) > -1) {
        localstorage.item.selected_cities.splice(localstorage.item.selected_cities.indexOf(city), 1);
        localstorage.store();
        this.setState({city_removed: true, removed_city: city, updated: Date.now()});
      }
    }
    addCity(city) {
      if(this.state.removed_city) {
        localstorage.item.selected_cities.push(city);
        localstorage.store();
        this.setState({city_removed: false, removed_city: null, updated: Date.now()});
      }
    }
    addCityGenerated(e) {
      e.preventDefault();
      let lat = this.props.match.params.lat;
      let lng = this.props.match.params.lng;
      fetch(config.get('server_url') + '/time/search_cities?limit=1&lat=' + lat + '&lng=' + lng)
        .then( (r) => r.json() )
        .then( (j) => {
         // var city = j.cities[0];
          var object = {
            city: this.props.match.params.city,
            country: this.state.country,
            offset: 0,
            timezone: this.props.match.params.tz,
            place_id: '',
            location: {
              "lat": +lat,
              "lng": +lng
            }
          }
          localstorage.item.selected_cities.push(object);
          localstorage.store();
          this.setState({city_removed: false, removed_city: null, updated: Date.now()});
        } );
    }
    isCityAdded() {
      let isAdded = false;
      localstorage.item.selected_cities.map( (city) => {
        console.log(city)
        if(city.city === this.props.match.params.city
            && this.props.match.params.lat === city.location.lat
            && this.props.match.params.lng === city.location.lng
          ) {
          isAdded = true;
        }
        return city;
      } );
      return isAdded;
    }
    getCountryImage() {
      var application_id = config.get('application_id');
      var url = 'https://api.unsplash.com/photos/search?client_id='+ application_id +'&query=' + this.state.country;
      return fetch(url).then( (r) => r.json() );
    }
    getCityImage(){
        var application_id = config.get('application_id');
        var url = 'https://api.unsplash.com/photos/search?client_id='+ application_id +'&query=' + this.props.match.params.city;
      return fetch(url).then( (r) => r.json() );

    }
    render() {
    	var txtblock = window.textblock;  
        let props = this.props;
        var remove_button = '';
        var bgImage = '';

        if(this.state.country) {
          if(!this.bgImage && this.bgImageLoading === false) {
            bgImage = bg;
            console.log('load');
            this.bgImageLoading = true;
           // var imagecheck =false;
            this.getCityImage().then((j) => {
                if(j.length>0 && j[0].urls) {
                this.bgImageLoading = false;
                var regular = j[0].urls.regular;
                this.bgImage = regular;
                this.setState({bgImage: regular});
                
                
              }
              else
              {
                   
                 this.getCountryImage().then((j) => {
	              if(j.length>0 && j[0].urls) {
	                this.bgImageLoading = false;
	                var regular = j[0].urls.regular;
	                this.bgImage = regular;
	                this.setState({bgImage: regular});
	             
	                 
	              }
	          })
                }

            });
            

          } else if(this.bgImage && this.bgImageLoading === false){
            bgImage = this.bgImage;
          } else {
            bgImage = '';
          }
        } else {
          bgImage = '';
        }

        if(localstorage.item.selected_cities.length > 1) {
          var city = null;
          for (var i in localstorage.item.selected_cities) {
            if(localstorage.item.selected_cities[i].location.lat === parseFloat(this.props.match.params.lat) 
              && localstorage.item.selected_cities[i].location.lng === parseFloat(this.props.match.params.lng)
              ){
                city = localstorage.item.selected_cities[i];
              }
          }
          if(city) {
            remove_button = (
              <a  onClick={this.removeCity.bind(this, city)} className="quick-action-btn">
                <FontAwesome name="times-circle" />
                Remove City
              </a>
            );
          } else if(this.state.city_removed) {
            remove_button = (
              <a onClick={this.addCity.bind(this, this.state.removed_city)} className="quick-action-btn">
                <FontAwesome name="plus-circle" />
                Add City
              </a>
            );
          } else if(this.isCityAdded() === false) {
            remove_button = (
              <a onClick={this.addCityGenerated.bind(this)} className="quick-action-btn">
                <FontAwesome name="plus-circle" />
                Add City
              </a>
            );
          }
        }
        return (
          <div className="detail-page">
          <Container fluid={true} id="backgroundtop" className="top-background-image-container" style={{backgroundSize: 'cover', backgroundImage: 'url('+ bgImage +')', backgroundPosition: '50% 0', backgroundRepeat: 'no-repeat'}}>
          	<div className="over_lay"><Row>
          		<Col className="home-header">
          			<div className="title">
                  <Link to="/">
                    <img alt="logo" src={logo} srcSet={logo + ' 1x,'+ logo2x + ' 2x'} />
                  </Link>
                </div>
          		</Col>
          	</Row>
          	<Row id="timewidget">
          		<Col xs="12" className="timewidg">
          			<ClockLarge {...props} setCountry={this.setCountry.bind(this)}/>
          		</Col>
          		<Col xs="12" className='text-center'>
                  <Link to="/" className="quick-action-btn">
                    <FontAwesome name="globe" />
                    View on Map
                  </Link>
                  &nbsp;
                  {remove_button}
                </Col>
          	</Row>
            <Row id="buttonrow">
                
            </Row></div>  
          </Container>
          <ScrollingCities {...props} cityRemoved={this.state.updated} />
          <Container>
            
            <Row>
              <Col xs="12">
                <Advertisement adurl={config.get('ad_url')}/>
              </Col>
            </Row>
            <Row>
               <Col xs="12">
                <h1 className="citytitle">What time is it in  {this.props.match.params.city} , {this.state.country} </h1> 
              </Col>
            </Row>
            <Row className="stretch-items">
                <Col xs="12" sm="4">
                    <WeatherWidget {...props} country={this.state.country} setPopulation={this.setPopulation.bind(this)}/>
                </Col>
                <Col xs="12" sm="4">
                    <SunTimesWidget {...props} country={this.state.country} />
                </Col>
                <Col xs="12" sm="4">
                    <MoonTimesWidget {...props} country={this.state.country} />
                </Col>
            </Row>
            <Row>
              <Col xs="12">
                <Advertisement adurl={config.get('ad_url2')} />
              </Col>
            </Row>
            <Row className="stretch-items">
                <Col xs="12" sm="4">
                    <DaylightWidget {...props} />
                </Col>
                <Col xs="12" sm="4">
                    <CompareWidget {...props} country={this.state.country} />
                </Col>
                <Col xs="12" sm="4">
                    <AirportWidget {...props} />
                </Col>
            </Row>

          </Container>
          <MapThisWidget {...props} population={this.state.population} country={this.state.country} />
          <CountryCitiesWidget {...props} country={this.state.country} />
         
           <div className="what-time-customblock" id="textblock"> 
           <Container>
              <Row>
               <Col xs="12">
	                 <div className="stretch-items" id="newcustomblock">
	                           <span dangerouslySetInnerHTML={{__html: txtblock}}></span>

						</div> 
			  </Col>
				</Row>
		   </Container>
           </div>
          <WhatTimeWidget {...props} />
          </div> 
        );
    }
}