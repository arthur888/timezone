import {React} from 'react';
import {Link} from 'react-router-dom';

var storage = {
	ver: 0.2,
	item: {},
	defaults: function(){
		storage.item = {
			ver: 0.2,
			current: {},
			selected_cities: []
		}
	},
	store: function(){
		localStorage.setItem('w4c7s3EItems', JSON.stringify(storage.item));
	},
	read: function() {
		if(localStorage.getItem('w4c7s3EItems')) {
			var parsed = JSON.parse(localStorage.getItem('w4c7s3EItems'));
			if(parsed) {
				if(parsed.ver !== storage.ver) {
					localStorage.setItem('w4c7s3EItems', null);
					storage.defaults();
				} else {
					storage.item = parsed;	
				}
			} else {
				storage.defaults();
			}
		} else {
				storage.defaults();
		}
	},
	add_city: function(place, timezone) {
		storage.remove_city(place.place_id);

		storage.item.selected_cities.push({
			city: place.vicinity,
			offset: place.utc_offset,
			timezone: timezone.timeZoneId,
			place_id: place.place_id,
			location: {
				lat: place.geometry.location.lat(),
				lng: place.geometry.location.lng()
			}
		});
		storage.store();
	},
	remove_city: function(place_id) {
		storage.item.selected_cities.forEach((e, i) => {
			if(e.place_id === place_id) {
				storage.item.selected_cities.splice(i, 1);
			}
		} );
		storage.store();
	},
	create_city_url: function(place_id, city) {
		return (<Link to="/time/:city/:place_id" params={{place_id: place_id, city: city}} />);
	}
}

storage.read();

export default storage;