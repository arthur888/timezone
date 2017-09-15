import React, {Component} from 'react';
import {Map, Marker, TileLayer, Tooltip} from 'react-leaflet';
import {Icon} from 'leaflet';
import moment from 'moment-timezone';
import FontAwesome from 'react-fontawesome';

import markerIcon from '../assets/map-pin.png';
import 'leaflet/dist/leaflet.css';

export default class MapThisWidget extends Component {
	constructor(props) {
		super(props);
		this.state = {
			extraInfo: true
		}
	}
	render() {
		let apistyle = '&apistyle=' + this.getEncodedStyles(this.getMapStyle());
		let url = 'https://mts0.google.com/vt/lyrs=m@289000001&hl=en&src=app&x={x}&y={y}&z={z}&s=Gal' + apistyle
		let position = [parseFloat(this.props.match.params.lat), parseFloat(this.props.match.params.lng)];
		return (
			<div className="map-this-widget">
				<div className={'extra-info ' + (this.state.extraInfo ? '' : 'hide')}>
					<div className="show-hide">
						<FontAwesome name="angle-right e-btn e-show" onClick={ () => {this.setState({extraInfo: true})} }/>
						<FontAwesome name="angle-left e-btn e-hide" onClick={ () => {this.setState({extraInfo: false})} }/>
					</div>
					<div className="title-row">{this.props.match.params.city} on the map</div>
					<div className="simple-row">Location: {this.props.match.params.city}, {this.props.country}</div>
					<div className="simple-row">Latitude: {parseFloat(this.props.match.params.lat).toFixed(6)} 
						&nbsp;Longitude: {parseFloat(this.props.match.params.lng).toFixed(6)}</div>
					{(this.props.population > 0) ? (<div className="simple-row">Country Population: {this.props.population}</div>) : ''}		
					
				</div>
				<Map scrollWheelZoom={false} center={position} zoom={4} style={{ height: '400px' }}>
					<TileLayer url={url}
						attribution='&copy; <a href="#">Timefinder</a>'/>
					<Marker icon={new Icon({iconUrl: markerIcon, iconSize: [20, 28], iconAnchor: [10,28], popupAnchor: [0, -28] })}
						position={position}>
						<Tooltip direction='top' permanent={true} offset={[0, -26]}>
			              <div style={{ textAlign:'center' }}>
			              	{this.props.match.params.city}
			              	<div style={{ fontWeight: '500' }}>{moment().tz(this.props.match.params.tz).format('hh:mm A')}</div>
			              </div>
			            </Tooltip>
			        </Marker>    
				</Map>
			</div>
		);
	}
	getEncodedStyles(styles){
		var ret = "";
		var styleparse_types = {"all":"0","administrative":"1","administrative.country":"17","administrative.land_parcel":"21","administrative.locality":"19","administrative.neighborhood":"20","administrative.province":"18","landscape":"5","landscape.man_made":"81","landscape.natural":"82","poi":"2","poi.attraction":"37","poi.business":"33","poi.government":"34","poi.medical":"36","poi.park":"40","poi.place_of_worship":"38","poi.school":"35","poi.sports_complex":"39","road":"3","road.arterial":"50","road.highway":"49","road.local":"51","transit":"4","transit.line":"65","transit.station":"66","water":"6"};
		var styleparse_elements = {"all":"a","geometry":"g","geometry.fill":"g.f","geometry.stroke":"g.s","labels":"l","labels.icon":"l.i","labels.text":"l.t","labels.text.fill":"l.t.f","labels.text.stroke":"l.t.s"};
		var styleparse_stylers = {"color":"p.c","gamma":"p.g","hue":"p.h","invert_lightness":"p.il","lightness":"p.l","saturation":"p.s","visibility":"p.v","weight":"p.w"};
		for(let i=0;i<styles.length;i++){
		    if(styles[i].featureType){
		        ret += "s.t:"+styleparse_types[styles[i].featureType]+"|";
		    }
		    if(styles[i].elementType){
		        if(!styleparse_elements[styles[i].elementType])
		            console.log("style element transcription unkown:"+styles[i].elementType);
		        ret += "s.e:"+styleparse_elements[styles[i].elementType]+"|";
		    }
		    if(styles[i].stylers){
		        for(let u=0;u<styles[i].stylers.length;u++){
		            var cstyler = styles[i].stylers[u]
		            for(var k in cstyler){
		                if(k==="color"){
		                    if(cstyler[k].length===7)
		                        cstyler[k] = "#ff"+cstyler[k].slice(1);
		                    else if(cstyler[k].length!==9)
		                        console.log("malformed color:"+cstyler[k]);
		                }
		                ret += styleparse_stylers[k]+":"+cstyler[k]+"|";
		            }
		        }
		    }
		    ret = ret.slice(0,ret.length-1);
		    ret += ","
		}
		return encodeURIComponent(ret.slice(0,ret.length-1));
	}
	getMapStyle() {
		return [
			  {
			    "elementType": "geometry",
			    "stylers": [
			      {
			        "color": "#515151"
			      }
			    ]
			  },
			  {
			    "elementType": "labels.icon",
			    "stylers": [
			      {
			        "visibility": "off"
			      }
			    ]
			  },
			  {
			    "elementType": "labels.text.fill",
			    "stylers": [
			      {
			        "color": "#757575"
			      }
			    ]
			  },
			  {
			    "elementType": "labels.text.stroke",
			    "stylers": [
			      {
			        "color": "#212121"
			      }
			    ]
			  },
			  {
			    "featureType": "administrative",
			    "elementType": "geometry",
			    "stylers": [
			      {
			        "color": "#757575"
			      }
			    ]
			  },
			  {
			    "featureType": "administrative.country",
			    "elementType": "labels.text.fill",
			    "stylers": [
			      {
			        "color": "#9e9e9e"
			      }
			    ]
			  },
			  {
			    "featureType": "administrative.land_parcel",
			    "stylers": [
			      {
			        "visibility": "off"
			      }
			    ]
			  },
			  {
			    "featureType": "administrative.locality",
			    "elementType": "labels.text.fill",
			    "stylers": [
			      {
			        "color": "#bdbdbd"
			      }
			    ]
			  },
			  {
			    "featureType": "poi",
			    "elementType": "labels.text.fill",
			    "stylers": [
			      {
			        "color": "#757575"
			      }
			    ]
			  },
			  {
			    "featureType": "poi.park",
			    "elementType": "geometry",
			    "stylers": [
			      {
			        "color": "#181818"
			      }
			    ]
			  },
			  {
			    "featureType": "poi.park",
			    "elementType": "labels.text.fill",
			    "stylers": [
			      {
			        "color": "#616161"
			      }
			    ]
			  },
			  {
			    "featureType": "poi.park",
			    "elementType": "labels.text.stroke",
			    "stylers": [
			      {
			        "color": "#1b1b1b"
			      }
			    ]
			  },
			  {
			    "featureType": "road",
			    "elementType": "geometry.fill",
			    "stylers": [
			      {
			        "color": "#2c2c2c"
			      }
			    ]
			  },
			  {
			    "featureType": "road",
			    "elementType": "labels.text.fill",
			    "stylers": [
			      {
			        "color": "#8a8a8a"
			      }
			    ]
			  },
			  {
			    "featureType": "road.arterial",
			    "elementType": "geometry",
			    "stylers": [
			      {
			        "color": "#373737"
			      }
			    ]
			  },
			  {
			    "featureType": "road.highway",
			    "elementType": "geometry",
			    "stylers": [
			      {
			        "color": "#3c3c3c"
			      }
			    ]
			  },
			  {
			    "featureType": "road.highway.controlled_access",
			    "elementType": "geometry",
			    "stylers": [
			      {
			        "color": "#4e4e4e"
			      }
			    ]
			  },
			  {
			    "featureType": "road.local",
			    "elementType": "labels.text.fill",
			    "stylers": [
			      {
			        "color": "#616161"
			      }
			    ]
			  },
			  {
			    "featureType": "transit",
			    "elementType": "labels.text.fill",
			    "stylers": [
			      {
			        "color": "#757575"
			      }
			    ]
			  },
			  {
			    "featureType": "water",
			    "elementType": "geometry",
			    "stylers": [
			      {
			        "color": "#a7a7a7"
			      }
			    ]
			  },
			  {
			    "featureType": "water",
			    "elementType": "labels.text.fill",
			    "stylers": [
			      {
			        "color": "#3d3d3d"
			      }
			    ]
			  }
			];
	}
}