import React, { Component } from 'react';
import {InputGroup, InputGroupAddon} from 'reactstrap';
import FontAwesome from 'react-fontawesome';
//import moment from 'moment-timezone';
import preloader from '../assets/tf-preloader.gif';

export default class SearchBar extends Component {
	placeSelected() {
		this.props.onupdate(this.textInput.value);
	}
	componentDidUpdate(){
		if(this.props.searchMode === true) {
			this.textInput.focus();
		} else {
			this.textInput.value = '';
		}
	}
	componentDidMount() {
		this.textInput.addEventListener('focus', (e) => {
			document.getElementById('search-box-addon').classList.add('active');
		});
		this.textInput.addEventListener('blur', (e) => {
			document.getElementById('search-box-addon').classList.remove('active');
		});
	}
	render() {
		return (
			<InputGroup className="search-box">
				<InputGroupAddon id="search-box-addon">
					{this.props.keywords.length === 0 ? (<FontAwesome name="search" />) : (<FontAwesome name="times" style={{color: '#ed1c24', 'cursor': 'pointer'}} onClick={()=>{this.textInput.value = ''; this.placeSelected()}} />)} 
				</InputGroupAddon>
				<input type="text"
					placeholder="Search a city name..."
					ref={(input) => { this.textInput = input; }}
				    className="form-control"
				    onKeyUp={this.placeSelected.bind(this)}
				/>
				{this.props.isSearching ? (<img alt="" src={preloader} className="preloader"/>) : ''}
			</InputGroup>
			
		);
	}
}