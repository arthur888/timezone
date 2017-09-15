import config from 'react-global-configuration';

function GetCity(city, country, forceResolve) {
	return new Promise(function(resolve, reject){
		if(Object.keys(city.location).length > 0) {
			return resolve.call(this, city);
		}
		try{
			fetch('https://maps.googleapis.com/maps/api/geocode/json?key='+ config.get('google_key') +'&address=' + city.city +',' + country)
			.then( (rs) => rs.json() )
			.then( (js) => {
				if(js.results.length === 0) {
					if(forceResolve === true) {
						resolve.call(this, city);
					} else {
						
					}
					return false;
				}
				let l = js.results[0].geometry.location;
				setTimeout( () => {
				fetch('https://maps.googleapis.com/maps/api/timezone/json?location='+ l.lat +','+ l.lng +'&timestamp='+ (Date.now() / 1000) +'&key=' + config.get('google_key'))
					.then( (rss) => rss.json() )
					.then( (jss) => {
						var fd = {
							'country': country,
							'city': city.city,
							'location': js,
							'timezone': jss
						};
						setTimeout( () => { /*
							fetch(config.get('server_url') + '/time/update', {
								method: 'post',
								body: JSON.stringify(fd),
								headers: {
									'Content-Type': 'application/json',
									'Accept': 'application/json'
								}
							}).then( (j) => {return j.json()} )
							.then( (d) => {
								// console.log(d) // shows current updated status
							} ); */
						}, Date.now() % 200 * Math.random() * 1000 );
						
						resolve.call(this, fd);
					} ).catch( (e) => {
						if(forceResolve === true) {
							resolve.call(this, city);
						} else {
							reject.call(this, city);
						}
					});
				}, 200);

			} ).catch( (e) =>{
				if(forceResolve === true) {
					resolve.call(undefined, city);
				} else {
					reject.call(undefined, city);
				}
			} );
		} catch(e) {
			if(forceResolve === true) {
				resolve.call(undefined, city);
			} else {
				reject.call(undefined, city);
			}
		}
		
	});
}

export default GetCity;