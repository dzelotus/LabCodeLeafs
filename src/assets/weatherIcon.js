/* eslint-disable global-require */
const imageSwitch = (icon) => {
	switch (icon) {
		case '01n':
			return require('../../assets/weatherImages/01n.png');
		case '01d':
			return require('../../assets/weatherImages/01d.png');
		case '02n':
			return require('../../assets/weatherImages/02n.png');
		case '02d':
			return require('../../assets/weatherImages/02d.png');
		case '03d':
			return require('../../assets/weatherImages/03d.png');
		case '03n':
			return require('../../assets/weatherImages/03d.png');
		case '04n':
			return require('../../assets/weatherImages/04n.png');
		case '04d':
			return require('../../assets/weatherImages/04n.png');
		case '09d':
			return require('../../assets/weatherImages/09n.png');
		case '09n':
			return require('../../assets/weatherImages/09n.png');
		case '10d':
			return require('../../assets/weatherImages/10n.png');
		case '10n':
			return require('../../assets/weatherImages/10n.png');
		case '11d':
			return require('../../assets/weatherImages/11n.png');
		case '11n':
			return require('../../assets/weatherImages/11n.png');
		case '13d':
			return require('../../assets/weatherImages/13n.png');
		case '13n':
			return require('../../assets/weatherImages/13n.png');
		case '50n':
			return require('../../assets/weatherImages/50n.png');
		case '50d':
			return require('../../assets/weatherImages/50n.png');
		default:
			return require('../../assets/weatherImages/01n.png');
	}
};

export default imageSwitch;
