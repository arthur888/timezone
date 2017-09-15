import React, {Component} from 'react';

export default class Advertisement extends Component {
	componentDidMount() {
		fetch(this.props.adurl)
			.then( (r) => r.text())
			.then( (h) => {
				this.div.innerHTML = h;
			} )
	}
	render() {
		return (<div ref={(div) => {this.div = div} } style={{margin: '0 auto', maxWidth: '840px', backgroundColor: '#fff', border: '', padding: '0', textAlign: '', marginBottom: '15px', fontSize: '', fontWeight: ''}}>
			
		</div>);
	}
}