import React, {Component} from 'react';
import moment from 'moment-timezone';


import icon_moonrise from '../assets/icon/moonrise@2x.png'; //'../../public/images/moon/svg/002-half-moon.svg';
import icon_moonset from '../assets/icon/moonset@2x.png'; //'../../public/images/moon/svg/001-night.svg';

var suncalc = require('suncalc');
var lune = require('../libs/lune/lib/lune');

export default class MoonTimesWidget extends Component {
	render() {
		var props = this.props;

		var tz = props.tz || props.match.params.tz || moment.tz.guess();
		var lat = props.lat || props.match.params.lat || 0;
		var lng = props.lng || props.match.params.lng || 0;

		let night = suncalc.getTimes(moment().tz(tz).toDate(), lat, lng);
		var moonrise = moment(night.night).tz(tz).format('h:mma');
		var moonset = moment(night.nightEnd).tz(tz).format('h:mma');
		if(moonrise === 'Invalid date') {
			moonrise = 'N/A';
		}
		if(moonset === 'Invalid date') {
			moonset = 'N/A';
		}

		let phaseData = lune.phase(moment().tz(tz).toDate());
		var illumination = phaseData.illuminated * 100;
		illumination = illumination.toFixed(0);
		return (
			<div className="widget moontimes-widget">
				<div className="widget-title"><span className="caption"><h2>Moon</h2></span></div>
				<div className="icons-place">
					<div className="icon-holder">
						<img alt="rise" src={icon_moonrise} />
					</div>
					<div className="icon-holder">
						<img alt="set" src={icon_moonset} />
					</div>
				</div>
				<div className="sub-title">
					<h3>Moonrise and Moonset in {this.props.match.params.city}, {this.props.country}</h3>
				</div>
				<div className="info-short">Moon: {illumination}%</div>
				<div className="info-row">
					<div className="heading">Rise</div>
					<div className="content">{moonrise}</div>
				</div>
				<div className="info-row">
					<div className="heading">Set</div>
					<div className="content">{moonset}</div>
				</div>
			</div>
		);
	}
}