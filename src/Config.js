import config from 'react-global-configuration';

config.set({
	server_url: 'http://' + window.location.hostname + ':3001',
	google_key: 'AIzaSyA-g9m478f3aaVG8OFY0e9fghw2XmHqi7U', // google api key
	//google_key:'AIzaSyAV66jr0VaDV7bvNg9QxQF1y5E4ve1KLGY',     
	openweatherapi: 'c75e5343e5cdb628dfa4445ce8b17128',
	application_id: 'cb26c1b14dd235a4c70a4eccb1ff81c5f77e44e4a54313391015000e700ebad6', // for unsplash
	ad_url: '/adcode.html',
	ad_url2: '/adcode2.html',
	ad_url_small: '/adcode_small.html',
	ad_url_header: '/adcode_header.html'
}, {freeze: false});

export default config;