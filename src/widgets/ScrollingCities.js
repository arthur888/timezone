import React, {Component} from 'react';
import moment from 'moment-timezone';
import config from 'react-global-configuration';
import storage from '../libs/localstorage';
//import {Link} from 'react-router-dom';
/*
Timezones list::

[
	"Asia/Kabul",
    "Europe/Mariehamn",
    "Europe/Tirane",
    "Africa/Algiers",
    "Pacific/Pago_Pago",
    "Europe/Andorra",
    "Africa/Luanda",
    "America/Anguilla",
    "Antarctica/Casey",
    "Antarctica/Davis",
    "Antarctica/DumontDUrville",
    "Antarctica/Mawson",
    "Antarctica/McMurdo",
    "Antarctica/Palmer",
    "Antarctica/Rothera",
    "Antarctica/Syowa",
    "Antarctica/Troll",
    "Antarctica/Vostok",
    "America/Antigua",
    "America/Argentina/Buenos_Aires",
    "America/Argentina/Catamarca",
    "America/Argentina/Cordoba",
    "America/Argentina/Jujuy",
    "America/Argentina/La_Rioja",
    "America/Argentina/Mendoza",
    "America/Argentina/Rio_Gallegos",
    "America/Argentina/Salta",
    "America/Argentina/San_Juan",
    "America/Argentina/San_Luis",
    "America/Argentina/Tucuman",
    "America/Argentina/Ushuaia",
    "Asia/Yerevan",
    "America/Aruba",
    "Antarctica/Macquarie",
    "Australia/Adelaide",
    "Australia/Brisbane",
    "Australia/Broken_Hill",
    "Australia/Currie",
    "Australia/Darwin",
    "Australia/Eucla",
    "Australia/Hobart",
    "Australia/Lindeman",
    "Australia/Lord_Howe",
    "Australia/Melbourne",
    "Australia/Perth",
    "Australia/Sydney",
    "Europe/Vienna",
    "Asia/Baku",
    "America/Nassau",
    "Asia/Bahrain",
    "Asia/Dhaka",
    "America/Barbados",
    "Europe/Minsk",
    "Europe/Brussels",
    "America/Belize",
    "Africa/Porto-Novo",
    "Atlantic/Bermuda",
    "Asia/Thimphu",
    "America/La_Paz",
    "America/Kralendijk",
    "Europe/Sarajevo",
    "Africa/Gaborone",
    "America/Araguaina",
    "America/Bahia",
    "America/Belem",
    "America/Boa_Vista",
    "America/Campo_Grande",
    "America/Cuiaba",
    "America/Eirunepe",
    "America/Fortaleza",
    "America/Maceio",
    "America/Manaus",
    "America/Noronha",
    "America/Porto_Velho",
    "America/Recife",
    "America/Rio_Branco",
    "America/Santarem",
    "America/Sao_Paulo",
    "Indian/Chagos",
    "America/Tortola",
    "Asia/Brunei",
    "Europe/Sofia",
    "Africa/Ouagadougou",
    "Africa/Bujumbura",
    "Asia/Phnom_Penh",
    "Africa/Douala",
    "America/Atikokan",
    "America/Blanc-Sablon",
    "America/Cambridge_Bay",
    "America/Creston",
    "America/Dawson",
    "America/Dawson_Creek",
    "America/Edmonton",
    "America/Fort_Nelson",
    "America/Glace_Bay",
    "America/Goose_Bay",
    "America/Halifax",
    "America/Inuvik",
    "America/Iqaluit",
    "America/Moncton",
    "America/Nipigon",
    "America/Pangnirtung",
    "America/Rainy_River",
    "America/Rankin_Inlet",
    "America/Regina",
    "America/Resolute",
    "America/St_Johns",
    "America/Swift_Current",
    "America/Thunder_Bay",
    "America/Toronto",
    "America/Vancouver",
    "America/Whitehorse",
    "America/Winnipeg",
    "America/Yellowknife",
    "Atlantic/Cape_Verde",
    "America/Cayman",
    "Africa/Bangui",
    "Africa/Ndjamena",
    "America/Punta_Arenas",
    "America/Santiago",
    "Pacific/Easter",
    "Asia/Shanghai",
    "Asia/Urumqi",
    "Indian/Christmas",
    "Indian/Cocos",
    "America/Bogota",
    "Indian/Comoro",
    "Pacific/Rarotonga",
    "America/Costa_Rica",
    "Europe/Zagreb",
    "America/Havana",
    "America/Curacao",
    "Asia/Famagusta",
    "Asia/Nicosia",
    "Europe/Prague",
    "Africa/Kinshasa",
    "Africa/Lubumbashi",
    "Europe/Copenhagen",
    "Africa/Djibouti",
    "America/Dominica",
    "America/Santo_Domingo",
    "Asia/Dili",
    "America/Guayaquil",
    "Pacific/Galapagos",
    "Africa/Cairo",
    "America/El_Salvador",
    "Africa/Malabo",
    "Africa/Asmara",
    "Europe/Tallinn",
    "Africa/Addis_Ababa",
    "Atlantic/Stanley",
    "Atlantic/Faroe",
    "Pacific/Fiji",
    "Europe/Helsinki",
    "Europe/Paris",
    "America/Cayenne",
    "Pacific/Gambier",
    "Pacific/Marquesas",
    "Pacific/Tahiti",
    "Indian/Kerguelen",
    "Africa/Libreville",
    "Africa/Banjul",
    "Asia/Tbilisi",
    "Europe/Berlin",
    "Europe/Busingen",
    "Africa/Accra",
    "Europe/Gibraltar",
    "Europe/Athens",
    "America/Danmarkshavn",
    "America/Godthab",
    "America/Scoresbysund",
    "America/Thule",
    "America/Grenada",
    "America/Guadeloupe",
    "Pacific/Guam",
    "America/Guatemala",
    "Europe/Guernsey",
    "Africa/Conakry",
    "Africa/Bissau",
    "America/Guyana",
    "America/Port-au-Prince",
    "America/Tegucigalpa",
    "Asia/Hong_Kong",
    "Europe/Budapest",
    "Atlantic/Reykjavik",
    "Asia/Kolkata",
    "Asia/Jakarta",
    "Asia/Jayapura",
    "Asia/Makassar",
    "Asia/Pontianak",
    "Asia/Tehran",
    "Asia/Baghdad",
    "Europe/Dublin",
    "Europe/Isle_of_Man",
    "Asia/Jerusalem",
    "Europe/Rome",
    "Africa/Abidjan",
    "America/Jamaica",
    "Asia/Tokyo",
    "Europe/Jersey",
    "Asia/Amman",
    "Asia/Almaty",
    "Asia/Aqtau",
    "Asia/Aqtobe",
    "Asia/Atyrau",
    "Asia/Oral",
    "Asia/Qyzylorda",
    "Africa/Nairobi",
    "Pacific/Enderbury",
    "Pacific/Kiritimati",
    "Pacific/Tarawa",
    "Asia/Kuwait",
    "Asia/Bishkek",
    "Asia/Vientiane",
    "Europe/Riga",
    "Asia/Beirut",
    "Africa/Maseru",
    "Africa/Monrovia",
    "Africa/Tripoli",
    "Europe/Vaduz",
    "Europe/Vilnius",
    "Europe/Luxembourg",
    "Asia/Macau",
    "Europe/Skopje",
    "Indian/Antananarivo",
    "Africa/Blantyre",
    "Asia/Kuala_Lumpur",
    "Asia/Kuching",
    "Indian/Maldives",
    "Africa/Bamako",
    "Europe/Malta",
    "Pacific/Kwajalein",
    "Pacific/Majuro",
    "America/Martinique",
    "Africa/Nouakchott",
    "Indian/Mauritius",
    "Indian/Mayotte",
    "America/Bahia_Banderas",
    "America/Cancun",
    "America/Chihuahua",
    "America/Hermosillo",
    "America/Matamoros",
    "America/Mazatlan",
    "America/Merida",
    "America/Mexico_City",
    "America/Monterrey",
    "America/Ojinaga",
    "America/Tijuana",
    "Pacific/Chuuk",
    "Pacific/Kosrae",
    "Pacific/Pohnpei",
    "Europe/Chisinau",
    "Europe/Monaco",
    "Asia/Choibalsan",
    "Asia/Hovd",
    "Asia/Ulaanbaatar",
    "Europe/Podgorica",
    "America/Montserrat",
    "Africa/Casablanca",
    "Africa/Maputo",
    "Asia/Yangon",
    "Africa/Windhoek",
    "Pacific/Nauru",
    "Asia/Kathmandu",
    "Europe/Amsterdam",
    "Pacific/Noumea",
    "Pacific/Auckland",
    "Pacific/Chatham",
    "America/Managua",
    "Africa/Niamey",
    "Africa/Lagos",
    "Pacific/Niue",
    "Pacific/Norfolk",
    "Asia/Pyongyang",
    "Pacific/Saipan",
    "Europe/Oslo",
    "Asia/Muscat",
    "Asia/Karachi",
    "Pacific/Palau",
    "Asia/Gaza",
    "Asia/Hebron",
    "America/Panama",
    "Pacific/Bougainville",
    "Pacific/Port_Moresby",
    "America/Asuncion",
    "America/Lima",
    "Asia/Manila",
    "Pacific/Pitcairn",
    "Europe/Warsaw",
    "Atlantic/Azores",
    "Atlantic/Madeira",
    "Europe/Lisbon",
    "America/Puerto_Rico",
    "Asia/Qatar",
    "Africa/Brazzaville",
    "Indian/Reunion",
    "Europe/Bucharest",
    "Asia/Anadyr",
    "Asia/Barnaul",
    "Asia/Chita",
    "Asia/Irkutsk",
    "Asia/Kamchatka",
    "Asia/Khandyga",
    "Asia/Krasnoyarsk",
    "Asia/Magadan",
    "Asia/Novokuznetsk",
    "Asia/Novosibirsk",
    "Asia/Omsk",
    "Asia/Sakhalin",
    "Asia/Srednekolymsk",
    "Asia/Tomsk",
    "Asia/Ust-Nera",
    "Asia/Vladivostok",
    "Asia/Yakutsk",
    "Asia/Yekaterinburg",
    "Europe/Astrakhan",
    "Europe/Kaliningrad",
    "Europe/Kirov",
    "Europe/Moscow",
    "Europe/Samara",
    "Europe/Saratov",
    "Europe/Simferopol",
    "Europe/Ulyanovsk",
    "Europe/Volgograd",
    "Africa/Kigali",
    "America/St_Barthelemy",
    "Atlantic/St_Helena",
    "America/St_Kitts",
    "America/St_Lucia",
    "America/Marigot",
    "America/Miquelon",
    "America/St_Vincent",
    "Pacific/Apia",
    "Europe/San_Marino",
    "Africa/Sao_Tome",
    "Asia/Riyadh",
    "Africa/Dakar",
    "Europe/Belgrade",
    "Indian/Mahe",
    "Africa/Freetown",
    "Asia/Singapore",
    "America/Lower_Princes",
    "Europe/Bratislava",
    "Europe/Ljubljana",
    "Pacific/Guadalcanal",
    "Africa/Mogadishu",
    "Africa/Johannesburg",
    "Atlantic/South_Georgia",
    "Asia/Seoul",
    "Africa/Juba",
    "Africa/Ceuta",
    "Atlantic/Canary",
    "Europe/Madrid",
    "Asia/Colombo",
    "Africa/Khartoum",
    "America/Paramaribo",
    "Arctic/Longyearbyen",
    "Africa/Mbabane",
    "Europe/Stockholm",
    "Europe/Zurich",
    "Asia/Damascus",
    "Asia/Taipei",
    "Asia/Dushanbe",
    "Africa/Dar_es_Salaam",
    "Asia/Bangkok",
    "Africa/Lome",
    "Pacific/Fakaofo",
    "Pacific/Tongatapu",
    "America/Port_of_Spain",
    "Africa/Tunis",
    "Europe/Istanbul",
    "Asia/Ashgabat",
    "America/Grand_Turk",
    "Pacific/Funafuti",
    "America/St_Thomas",
    "Africa/Kampala",
    "Europe/Kiev",
    "Europe/Uzhgorod",
    "Europe/Zaporozhye",
    "Asia/Dubai",
    "Europe/London",
    "America/Adak",
    "America/Anchorage",
    "America/Boise",
    "America/Chicago",
    "America/Denver",
    "America/Detroit",
    "America/Indiana/Indianapolis",
    "America/Indiana/Knox",
    "America/Indiana/Marengo",
    "America/Indiana/Petersburg",
    "America/Indiana/Tell_City",
    "America/Indiana/Vevay",
    "America/Indiana/Vincennes",
    "America/Indiana/Winamac",
    "America/Juneau",
    "America/Kentucky/Louisville",
    "America/Kentucky/Monticello",
    "America/Los_Angeles",
    "America/Menominee",
    "America/Metlakatla",
    "America/New_York",
    "America/Nome",
    "America/North_Dakota/Beulah",
    "America/North_Dakota/Center",
    "America/North_Dakota/New_Salem",
    "America/Phoenix",
    "America/Sitka",
    "America/Yakutat",
    "Pacific/Honolulu",
    "Pacific/Midway",
    "Pacific/Wake",
    "America/Montevideo",
    "Asia/Samarkand",
    "Asia/Tashkent",
    "Pacific/Efate",
    "Europe/Vatican",
    "America/Caracas",
    "Asia/Ho_Chi_Minh",
    "Pacific/Wallis",
    "Africa/El_Aaiun",
    "Asia/Aden",
    "Africa/Lusaka",
    "Africa/Harare"
]


*/

class ScrollingCity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            interval: 0,
            update: false
        }
    }
    componentWillMount() {
        if(!moment.is_updated) {
            fetch(config.get('server_url') + '/time/current')
                .then( (r) => r.json() )
                .then( (d) => {
                    var actual = d.timestamp;
                    var diff = moment().tz('UTC').diff(moment(actual));
                    moment.now = function(){
                        moment.is_updated = true;
                        return Date.now() - diff;
                    }
                } );
        }
    }
    componentDidMount() {
        var interval = setInterval( ()=> {
            this.setState({update: true});
        }, 1000);
        this.setState({'interval' : interval});
    }
    componentWillUnmount() {
        clearInterval(this.state.interval);
    }
	render() {
        var city = this.props.city;
        var link = '/timezone/' + city.city + '/' + city.location.lat + '/' + city.location.lng + '/' + city.tz;
		return (
			<li key={this.props.city} className="scrolling-city">
                <a href={link}>
				    <div className="city-name">{this.props.city.city}</div>
				    <div className="time">{moment().tz(this.props.city.tz).format('hh:mm A')}</div>
                    <div className="timezone">{moment().tz(this.props.city.tz).format('z/UTC Z')}</div>
                </a>
			</li>
		);
	}
}

export default class ScrollingCities extends Component {
	constructor(props) {
		super(props);
        this.total_width = 0;
        this.available_width = 0;
		this.state = {
			cities: this.getCities(),
            left_visible: false,
            right_visible: false,
            translateX: 0
		}
	}
    getCities() {
        var cities = [];
        storage.item.selected_cities.forEach( (city) => {
            cities.push({city: city.city, tz: city.timezone, location: city.location});
        });
        return cities;
    }
    componentDidUpdate(p) {
        if(this.props.cityRemoved !== p.cityRemoved) {
            this.setState({cities: this.getCities()});
            setTimeout( () => {this.initSlider()}, 200 );
        }
    }
    initSlider() {
        var total = 0;
        this.main_element.querySelectorAll('ul li').forEach( (li) => {
            total += li.clientWidth;
        });
        var space = this.main_element.clientWidth;

        if(total > space) {
            this.setState({right_visible: true})
        }

        this.available_width = space;
        this.total_width = total;
        this.per_page_increment = this.total_width / this.available_width;
        this.pages_count = Math.ceil(this.per_page_increment);
        this.current_page = 0;
        this.goToPage(0);
    }
    componentDidMount() {
        this.initSlider();
    }
    goToPage(page) {
        if(page >= this.pages_count) {
            page = this.pages_count;
            this.setState({right_visible:false, left_visible: true});
        } else if(page <= 0) {
            page = 0;
            this.setState({left_visible: false, right_visible: true});
        } else {
            this.setState({left_visible:true, right_visible: true});
        }
        if(this.available_width >= this.total_width) {
            this.setState({left_visible: false, right_visible: false});
            return false;
        }
        this.current_page = page;
        let translateX = 0;
        if(page === this.pages_count) {
            translateX = this.total_width - this.available_width;
            //console.log('last')
        } else if (page === 0) {
            translateX = 0;
            //console.log('first')
        } else if (page === this.pages_count -1) {
            //console.log('second last')
            translateX = (1/this.per_page_increment) * page * this.total_width;
            if(this.total_width - translateX <= this.available_width) {
                translateX = this.total_width - this.available_width;
                this.setState({left_visible:true, right_visible:false});
            }
        } else {
            //console.log('not end')
            translateX = (1/this.per_page_increment) * page * this.total_width;
            
        }
        
        this.setState({translateX: translateX * -1});
    }
    slideRight() {
        this.goToPage(this.current_page + 1);
    }
    slideLeft() {
        this.goToPage(this.current_page - 1);
    }
	render() {

		return (
			<div className="scrolling-cities-widget" ref={ (main_element) => {this.main_element = main_element} }>
                <div className="scroll-btn right-btn" onClick={this.slideRight.bind(this)} style={{display: (this.state.right_visible) ? 'block':'none' }}>&rsaquo;</div>
                <div className="scroll-btn left-btn" onClick={this.slideLeft.bind(this)} style={{display: (this.state.left_visible) ? 'block':'none' }}>&lsaquo;</div>
				<ul ref={ (ul) => {this.list_element = ul} } style={{ transform: 'translateX('+ this.state.translateX +'px)' }}>
					{this.state.cities.map((city, i) => <ScrollingCity key={i} city={city} />)}
				</ul>
			</div>
		);
	}
}
