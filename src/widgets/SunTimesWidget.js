import React, {Component} from 'react';
import moment from 'moment-timezone';

import icon_sunrise from '../assets/icon/sunrise@2x.png';//'../../public/images/sun/svg/001-sunrise.svg';
import icon_sunset from '../assets/icon/sunset@2x.png';//'../../public/images/sun/svg/002-sun.svg';

var suncalc = require('suncalc');

export default class SunTimesWidget extends Component {
	render() {
		var props = this.props;
		var tz = props.tz || props.match.params.tz || moment.tz.guess();
		var lat = props.lat || props.match.params.lat || 0;
		var lng = props.lng || props.match.params.lng || 0;
		let sun = suncalc.getTimes(moment().tz(tz).toDate(), lat, lng);
		let sunrise = moment(sun.sunrise).tz(tz);
		let sunset = moment(sun.sunset).tz(tz);
		return (
			<div className="widget suntimes-widget">
				<div className="widget-title"><span className="caption"><h2>Sun</h2></span></div>
				<div className="icons-place">
					<div className="icon-holder">
						<img alt="sunrise" src={icon_sunrise} />
					</div>
					<div className="icon-holder">
						<img alt="sunset" src={icon_sunset} />
					</div>
				</div>
				<div className="sub-title"><h3>Sunrise and Sunset in {this.props.match.params.city}, {this.props.country}</h3></div>
				<div className="info-row">
					<div className="heading">Sunrise</div>
					<div className="content">{sunrise.format('h:mma')}</div>
				</div>
				<div className="info-row">
					<div className="heading">Sunset</div>
					<div className="content">{sunset.format('h:mma')}</div>
				</div>
			</div>
		);
	}
}