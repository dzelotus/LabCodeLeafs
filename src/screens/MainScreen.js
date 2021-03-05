/* eslint-disable no-sequences */
/* eslint-disable consistent-return */
// *** NPM ***
import { ScrollView, View } from 'react-native';
import React, { useEffect, useState } from 'react';

import Geolocation from '@react-native-community/geolocation';
import RNBootSplash from 'react-native-bootsplash';

// *** OTHER ***
import LastScansCard from '../components/LastScansCard';
import NewsCard from '../components/NewsCard';
import WeatherCard from '../components/WeatherCard';
import nodeApi from '../api/nodeApi';
import weatherApi from '../api/weatherApi';
import FeedBack from '../components/FeedBack';

const { Conway } = require('@lab-code/moonphase');

const MainScreen = ({ navigation }) => {
	const [scans, setScans] = useState();
	const [weather, setWeather] = useState();
	const [moon, setMoon] = useState();
	const [newsData, setNewsData] = useState(null);

	const isHermes = () => !!global.HermesInternal;

	const getLastScans = () => {
		nodeApi
			.get('/scans')
			.then((response) => {
				const startArray = response.data.data;
				const data = startArray.slice(0, 9);
				setScans(data);
			})
			.catch((error) => console.log(error.response));
		RNBootSplash.hide();
	};

	const getArticles = () => {
		nodeApi
			.get('/articles')
			.then((response) => {
				setNewsData(response.data.data);
			})
			.catch((error) => console.log(error));
	};

	const getCoords = () =>
		Geolocation.getCurrentPosition(
			(info) => {
				checkWeather({ lon: info.coords.longitude, lat: info.coords.latitude });
			},
			(e) => {
				console.log(e);
			},
			{ timeout: 20000 },
		);

	const checkWeather = ({ lon, lat }) => {
		weatherApi
			.get('/weather', {
				params: {
					lon,
					lat,
					units: 'metric',
					lang: 'ru',
					appid: '8da265f8c41094bc3f5222f1837a983c',
				},
			})
			.then((info) => {
				setWeather({
					description: info.data.weather[0].description,
					icon: info.data.weather[0].icon,
					temp: info.data.main.temp,
					location: info.data.name,
					coords: { lon, lat },
				});
			})
			.catch((error) => console.log('!!!', error.response));
	};

	const getMoonPhase = () => {
		const day = new Date().getDay();
		const month = new Date().getMonth() + 1;
		const year = new Date().getFullYear();
		const moonphase = Conway(day, month, year);

		nodeApi
			.get(`/garden-calendar/moon-phase-calendar/${moonphase}`)
			.then((response) => {
				console.log('MOON RESP', response.data);
				setMoon(response.data.data);
			})
			.catch((error) => console.log('MOON ERR', error));
	};

	useEffect(() => {
		const getFocus = navigation.addListener('focus', () => {
			getLastScans();
			getCoords();
			getArticles();
			isHermes();
			getMoonPhase();
		});

		return getFocus;
	}, []);

	const WeatherCardShow = () => {
		if (weather) {
			return <WeatherCard weatherInfo={weather} moonInfo={moon} />;
		}
	};

	return (
		<View style={{ backgroundColor: 'white', flex: 1 }}>
			<ScrollView
				contentContainerStyle={{
					paddingTop: 10,
				}}
				keyboardShouldPersistTaps="always"
			>
				{/* NEWS */}
				<NewsCard iconName="star-o" nav="News" headerText="Новости" newsData={newsData} />
				{/* SCANS CARD */}
				<LastScansCard
					headerText="Мои сканирования"
					nav="LastScan"
					iconName="pagelines"
					data={scans}
				/>
				{WeatherCardShow()}

				{/* FEEDBACK */}
				<FeedBack />
			</ScrollView>
		</View>
	);
};

export default MainScreen;
