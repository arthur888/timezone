import React, { Component } from 'react';
import {Map, Marker, Tooltip, TileLayer} from 'react-leaflet';
import {Icon} from 'leaflet';
import moment from 'moment-timezone';
import L from '../libs/L.Terminator';
import {getPolygon} from '../libs/TimezonePolygon';
import MobileDetect from 'mobile-detect';
import config from 'react-global-configuration';
//import {Redirect} from 'react-router-dom';

import markerIcon from '../assets/map-pin.png';
import 'leaflet/dist/leaflet.css';

export default class Mapside extends Component {
	constructor(props) {
		super(props);
		// parse properties
		let lat = parseFloat(props.lat) || 0;
		let lng = parseFloat(props.lng) || 0;
		let zoom = parseFloat(props.zoom)+1 || 13;
		// initialize the state
		this.state = {
			position: [lat, lng],
			zoom: zoom,
			timezoneInformation: '',
			os: new MobileDetect(navigator.userAgent),
			redirectTo: ''
		}

		this.polygons = [];
		this.polygonText = null;
	}

	triggerClick(x,y) {
		var latlngPoint = new L.LatLng(x, y);
		var map = this.map.leafletElement;
		var p = map.latLngToLayerPoint(latlngPoint);
		p.y += 50;
	    map.fireEvent('click', {
	      latlng: latlngPoint,
	      layerPoint: p,
	      containerPoint: map.latLngToContainerPoint(latlngPoint)
	    });
	}
	

	componentDidMount() {
		this.interval = setInterval( () => { this.setState({updated: true}) }, 1000);
		this.initHovers();
		
	}
	clearPolygons() {
		this.polygons.forEach( (p) => {
			this.map.leafletElement.removeLayer(p);
		});
		if(this.polygonText) {
			this.map.leafletElement.removeLayer(this.polygonText);
		}
	}
	initHovers() {
		var lastTimeout = null;
		this.map.leafletElement.on('click', (e) => {
			this.clearPolygons();
			if(this.props.timezone === false) {
				return false;
			}
			
			let latlng = e.latlng;
			var coords = getPolygon(latlng.lat, latlng.lng);
			if(coords.length > 0) {
				var content = '';
				coords.forEach( (coord) => {
					var prevTooltip = null;
					var prevPoly = null;
					coord.poly.forEach( (p, i) => {
						var r = parseInt((p.coords.length % 255).toFixed(0), 10).toString(16);
						var g = parseInt((p.coords.length * 25 % 255).toFixed(0), 10).toString(16);
						var b = parseInt((p.coords.length * 33 % 255).toFixed(0), 10).toString(16);
						var color = '#' + r + g + b;
						while(color.length < 7) {
							color += (i % 9).toString(16);
						}
						
						var polygon = L.polygon([p.coords], {
							fillColor: color,
							weight: 1,
							fillOpacity: 0.5
						});
						polygon.addTo(this.map.leafletElement);
						if(prevPoly){
							prevPoly.unbindTooltip(prevTooltip);
							
						}
						prevPoly = polygon;
						var zones = Object.keys(coord.bb.zoneCentroids);

						if(e.type === 'mousemove' && this.state.os.os() === null && false/*disable mousemove*/) {
							content = '<span style="font-size:14px;">Current Time: ' + moment.tz(coord.tz).format('hh:mmA') + '</span><br>' +
							'<span style="font-size:14px;margin-top: 4px;">Timezones:</span> <br>' + zones.join('<br>');
							var tooltip = L.tooltip({
								sticky: true,
								opacity: 1,
								width: 300
							}).setContent(content);
							polygon.bindTooltip(tooltip).openTooltip();
							prevTooltip = polygon.getTooltip();
							prevTooltip._contentNode.style.transform = 'translate('+ (e.layerPoint.x + 15) +'px,'+ (e.layerPoint.y - 20) +'px)';
						} else if(e.type === 'click') {
							clearTimeout(lastTimeout);
							lastTimeout = setTimeout( () => {

								content = '<i class="fa fa-circle-o-notch fa-spin"></i> Loading';
								var tooltip = L.tooltip({
									sticky: true,
									opacity: 1,
									width: 300
								}).setContent(content);
								try{
									polygon.bindTooltip(tooltip).openTooltip();
									prevTooltip = polygon.getTooltip();
									prevTooltip._contentNode.style.transform = 'translate('+ (e.layerPoint.x) +'px,'+ (e.layerPoint.y) +'px)';	
								} catch(e) {}
								
								var url = 'https://maps.googleapis.com/maps/api/timezone/json?location='+ e.latlng.lat +','+ e.latlng.lng +'&timestamp='+ (moment.now() / 1000) +'&key=' + config.get('google_key');
								fetch(url)
								.then((r) => r.json())
								.then((j) => {
									if(prevPoly){
										prevPoly.unbindTooltip(prevTooltip);
										
									}
									content = '<div style="font-size: 16px;">'+ j.timeZoneId +'</div>'
									+' <div style="font-size: 14px;">'+ j.timeZoneName +'</div>'
									+'<div style="font-size: 12px;">Current Time: '+ moment().tz(j.timeZoneId).format('hh:mm A') +'</div>'
									+'<div style="font-size: 12px;">Your Time: '+ moment().tz(moment.tz.guess()).format('hh:mm A') +'</div>'
									+'<div style="font-size: 12px;">UTC Offset (in hours): '+ moment.tz(j.timeZoneId).utcOffset() / 60 +'</div>';
									var tooltip = L.tooltip({
										sticky: true,
										opacity: 1,
										width: 300
									}).setContent(content);
									try{
										polygon.bindTooltip(tooltip).openTooltip();
										prevTooltip = polygon.getTooltip();
										prevTooltip._contentNode.style.transform = 'translate('+ (e.layerPoint.x - 50)  +'px,'+ (e.layerPoint.y - 20) +'px)';

									} catch(e){}
								
								});
							}, 200);
						}

						
						this.polygons.push(polygon);
						
					} );
				});
				if(content) {
					
				}
				
			} else {
				
			}
			
			
		});
	}
	componentDidUpdate(p) {
		if(this.props.twilight === true) {
			this.removeDayNightLayer();
			this.addDayNightLayer();
		} else {
			this.removeDayNightLayer();
		}
		if(this.props.timezone === false) {
			this.clearPolygons();
		}
		if(this.props.timezone === true && p.timezone === false) {
			this.triggerClick(this.props.autoDetected.lat, this.props.autoDetected.lon);
		}
	}
	componentWillUnmount() {
		clearInterval(this.interval);
	}
	removeDayNightLayer() {
		try{
			this.map.leafletElement.removeLayer(this.dayNightLayerMap);
		} catch(ex) {

		} 
	}
	addDayNightLayer() {
		if(this.map) {
			//console.log(this.map);
			var t = L.terminator();
			this.dayNightLayerMap = t;
			t.addTo(this.map.leafletElement);
			clearInterval(this.dayNightInterval);
			this.dayNightInterval = setInterval(function(){updateTerminator(t)}, 60000);
			function updateTerminator(t) {
			  var t2 = L.terminator();
			  t.setLatLngs(t2.getLatLngs());
			  t.redraw();
			}
		}
	}
	render() {
		if(this.state.redirectTo) {
			
			window.location.href=this.state.redirectTo;
			//return (<Redirect to={this.state.redirectTo} />);
		}
		let apistyle = '&apistyle=' + this.getEncodedStyles(this.getMapStyle());
		let url = 'https://mts0.google.com/vt/lyrs=m@289000001&hl=en&src=app&x={x}&y={y}&z={z}&s=Gal' + apistyle
		var corner1 = L.latLng(-89.98155760646617, -180),
		corner2 = L.latLng(89.99346179538875, 180),
		bounds = L.latLngBounds(corner1, corner2);
		return (
			<Map maxBounds={bounds} animate={false} minZoom={2} ref={(map)=>{this.map = map}} center={this.state.position} zoom={this.state.zoom}>
				<TileLayer url={url}
					attribution='&copy; <a href="#">Timefinder</a>'/>
				{/* Loop on markers */
					this.props.markers.map( (marker, k)=> {
						if(this.props.pins === false) {
							return false;
						}
						let url = '/timezone/' + marker.text + '/' + marker.lat + '/' + marker.lng + '/' + marker.tz;
						return (
						<Marker onClick={(m) => { this.setState({redirectTo: url}) }} icon={new Icon({iconUrl: markerIcon, iconSize: [20, 28], iconAnchor: [10,28], popupAnchor: [0, -28] })} key={k} 
							position={[marker.lat, marker.lng]}>
				            <Tooltip direction='top' permanent={true} offset={[0, -26]}>
				              <div style={{ textAlign:'center' }}>
				              	{marker.text}, {marker.country}
				              	<div style={{ fontWeight: '500' }}>{moment().tz(marker.tz).format('hh:mm A')}</div>
				              </div>
				            </Tooltip>
				        </Marker>)
					})
				}
				
			</Map>
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
		let style = [
		  {
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "color": "#f5f5f5"
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
		        "color": "#616161"
		      }
		    ]
		  },
		  {
		    "elementType": "labels.text.stroke",
		    "stylers": [
		      {
		        "color": "#f5f5f5"
		      }
		    ]
		  },
		  {
		    "featureType": "administrative.land_parcel",
		    "elementType": "labels.text.fill",
		    "stylers": [
		      {
		        "color": "#bdbdbd"
		      }
		    ]
		  },
		  {
		    "featureType": "landscape",
		    "elementType": "geometry.fill",
		    "stylers": [
		      {
		        "color": "#e5e5e5"
		      }
		    ]
		  },
		  {
		    "featureType": "poi",
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "color": "#eeeeee"
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
		        "color": "#e5e5e5"
		      }
		    ]
		  },
		  {
		    "featureType": "poi.park",
		    "elementType": "labels.text.fill",
		    "stylers": [
		      {
		        "color": "#9e9e9e"
		      }
		    ]
		  },
		  {
		    "featureType": "road",
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "color": "#ffffff"
		      }
		    ]
		  },
		  {
		    "featureType": "road.arterial",
		    "elementType": "labels.text.fill",
		    "stylers": [
		      {
		        "color": "#757575"
		      }
		    ]
		  },
		  {
		    "featureType": "road.highway",
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "color": "#dadada"
		      }
		    ]
		  },
		  {
		    "featureType": "road.highway",
		    "elementType": "labels.text.fill",
		    "stylers": [
		      {
		        "color": "#616161"
		      }
		    ]
		  },
		  {
		    "featureType": "road.local",
		    "elementType": "labels.text.fill",
		    "stylers": [
		      {
		        "color": "#9e9e9e"
		      }
		    ]
		  },
		  {
		    "featureType": "transit.line",
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "color": "#e5e5e5"
		      }
		    ]
		  },
		  {
		    "featureType": "transit.station",
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "color": "#eeeeee"
		      }
		    ]
		  },
		  {
		    "featureType": "water",
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "color": "#c9c9c9"
		      }
		    ]
		  },
		  {
		    "featureType": "water",
		    "elementType": "geometry.fill",
		    "stylers": [
		      {
		        "color": "#ffffff"
		      },
		      {
		        "visibility": "on"
		      }
		    ]
		  },
		  {
		    "featureType": "water",
		    "elementType": "labels.text.fill",
		    "stylers": [
		      {
		        "color": "#9e9e9e"
		      }
		    ]
		  }
		];
		return style;
	}
}