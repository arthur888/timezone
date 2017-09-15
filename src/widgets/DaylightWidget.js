import React, {Component} from 'react';
import moment from 'moment-timezone';
import dst from '../libs/dst';

export default class DaylightWidget extends Component {
	constructor(props) {
		super(props);
		var abbrs = {
		    EST : 'Eastern Standard Time',
		    EDT : 'Eastern Daylight Time',
		    CST : 'Central Standard Time',
		    CDT : 'Central Daylight Time',
		    MST : 'Mountain Standard Time',
		    MDT : 'Mountain Daylight Time',
		    PST : 'Pacific Standard Time',
		    PDT : 'Pacific Daylight Time',
		    IST : 'India Standard Time'
		};

		moment.fn.zoneNameLong = function () {
		    var abbr = this.zoneAbbr();
		    return abbrs[abbr] || abbr;
		}
	}
	render() {
		var props = this.props;
		var tz = props.tz || props.match.params.tz || moment.tz.guess();
		//var lat = props.lat || props.match.params.lat || 0;
		//var lng = props.lng || props.match.params.lng || 0;
		var dates = dst(moment().tz(tz).toDate());

		return (
			<div className="widget daylight-widget">
				<div className="widget-title"><span className="caption"><h2>Timezone</h2></span></div>
				<div className="timezone">
					<h3>{moment().tz(tz).format('z')}/UTC{moment().tz(tz).format('ZZ')} </h3>
				</div>
				<div className="timezone-fullname">{moment().tz(tz).zoneNameLong()}</div>
				<div className="sub-title">Daylight savings starts:</div>
				<div className="sub-value">{moment(dates.start).tz(tz).format('MMM D, YYYY')} (+1 hour)</div>
				<div className="sub-title">Daylight savings ends:</div>
				<div className="sub-value">{moment(dates.end).tz(tz).format('MMM D, YYYY')} (-1 hour)</div>
			</div>
		);
	}
}