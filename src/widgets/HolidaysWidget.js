import React, {Component} from 'react';
//import moment from 'moment-timezone';

export default class HolidaysWidget extends Component {
	render() {
		return (
			<div className="widget upcoming-holidays-widget">
				<div className="widget-title"><span className="caption"><h2>Holidays</h2></span></div>
				<div className="short-title"><h3>Upcoming Holidays:</h3></div>
				<table width="100%">
					<tbody>
					<tr>
						<td>Apr 14</td>
						<td>Good Friday</td>
					</tr>
					<tr>
						<td>Apr 14</td>
						<td>Good Friday</td>
					</tr>
					<tr>
						<td>Apr 14</td>
						<td>Good Friday</td>
					</tr>
					<tr>
						<td>Apr 14</td>
						<td>Good Friday</td>
					</tr>
					</tbody>
				</table>
			</div>
		);
	}
}