import React, { Component } from 'react';

import SearchBar from './SearchBar';
import DisplayTimes from './DisplayTimes';
import SearchResults from './SearchResults';
import Advertisement from '../widgets/Advertisement';
import config from 'react-global-configuration';

export default class Rightside extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchMode: false,
			keywords: '',
			showSidebar: true,
			isSearching: false
		}
	}
	setKeywords(keywords) {
		this.setState({
			keywords: keywords,
			searchMode: keywords.length > 0
		});
	}
	setIsSearching(mode) {
		this.setState({
			isSearching: mode
		});
	}
	setSearchMode(mode) {
		this.setState({
			searchMode: mode,
			keywords: (mode === false) ? '' : this.state.keywords
		});
	}
	getSidebarClass() {
		let classlist = 'cities-side search-sidebar';
		if(this.state.showSidebar === false) {
			classlist += ' hide-sidebar';
		}
		return classlist;
	}
	render() {
		return (
			<div className={this.getSidebarClass()}>
				{/*
				<div className="top-right-close">
					<FontAwesome name="times close-btn" onClick={ () => {this.setState({showSidebar: false})} }/>
					<FontAwesome name="bars open-btn" onClick={ () => {this.setState({showSidebar: true})} } />
				</div>
			*/}
				<SearchBar isSearching={this.state.isSearching} updateMarkers={this.props.updateMarkers} keywords={this.state.keywords} searchMode={this.state.searchMode} onupdate={this.setKeywords.bind(this)} />
				{(this.state.searchMode === false) ?
				<DisplayTimes updateMarkers={this.props.updateMarkers} setSearchMode={this.setSearchMode.bind(this)} onupdate={this.setKeywords.bind(this)} />
				: 
				<SearchResults setIsSearching={this.setIsSearching.bind(this)} keywords={this.state.keywords} setSearchMode={this.setSearchMode.bind(this)} updateMarkers={this.props.updateMarkers} />
				}
				<div className="side-ad">
					<Advertisement adurl={config.get('ad_url_small')}/>
				</div>
				<div className="side-ad-mobile">
					<Advertisement adurl={config.get('ad_url')}/>
				</div>
			</div>
		);
	}
}