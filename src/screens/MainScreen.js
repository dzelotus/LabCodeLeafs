/* eslint-disable no-sequences */
/* eslint-disable consistent-return */

/* Главный экран приложения "Мои растения" */

// *** NPM ***
import { ScrollView, View, Platform, Alert, Text, Button } from 'react-native';
import React, { useEffect, useState } from 'react';

import Geolocation from '@react-native-community/geolocation';
import RNBootSplash from 'react-native-bootsplash';
import { PERMISSIONS, request, check } from 'react-native-permissions';

// *** OTHER ***
import { connect } from 'react-redux';
import { resolveAuth, refreshConnection } from '../actions/AuthActions';
import LastScansCard from '../components/LastScansCard';
import NewsCard from '../components/NewsCard';
import WeatherCard from '../components/WeatherCard';
import nodeApi from '../api/nodeApi';
import weatherApi from '../api/weatherApi';
import FeedBack from '../components/FeedBack';
import { db } from '../database/database';

const { Conway } = require('@lab-code/moonphase');

const MainScreen = (props) => {
	const [scans, setScans] = useState();
	const [weather, setWeather] = useState();
	const [moon, setMoon] = useState();
	const [newsData, setNewsData] = useState(null);
	const [weatherLoading, setWeatherLoading] = useState(null);

	const isHermes = () => !!global.HermesInternal;

	const { navigation, refreshConnection, checkInternet } = props;

	const getLastScans = () => {
		nodeApi
			.get('/scans')
			.then((response) => {
				const startArray = response.data.data;
				const data = startArray.slice(0, 9);
				setScans(data);
			})
			.catch(() => /* console.log(error.response) */ null);
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

	const askPerms = async () => {
		if (Platform.OS === 'ios') {
			check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(async (result) => {
				console.log('IOS LOCATION', result);
				if (result === 'blocked') {
					Alert.alert(
						'Для доступа к прогнозу погоды необходимо предоставить доступ к геолокации в настройках телефона',
					);
				} else if (result === 'denied' || result === 'unavailable') {
					console.log('START ASKING');
					await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result) => {
						console.log('IOS LOCATION', result);
						getCoords();
					});
				}
			});
			getCoords();
		} else {
			check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(async (result) => {
				console.log('ANDROID LOCATION', result);
				if (result === 'blocked') {
					Alert.alert(
						'Для доступа к прогнозу погоды необходимо предоставить доступ к геолокации в настройках телефона',
					);
				} else if (result === 'denied' || result === 'unavailable') {
					console.log('START ASKING');
					await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result) => {
						console.log('ANDROID LOCATION', result);
						getCoords();
					});
				}
			});
			getCoords();
		}
	};

	const getCoords = () =>
		Geolocation.getCurrentPosition(
			(info) => {
				checkWeather({ lon: info.coords.longitude, lat: info.coords.latitude });
			},
			(e) => {
				console.log('GET COORDS ERR', e);
			},
			{ timeout: 20000 },
		);

	const checkWeather = ({ lon, lat }) => {
		setWeatherLoading(true);
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
				setWeatherLoading(false);
			})
			.catch(() => {
				setWeatherLoading(false);
			});
	};

	const getMoonPhase = () => {
		const day = new Date().getDate();
		const month = new Date().getMonth() + 1;
		const year = new Date().getFullYear();
		const moonphase = Conway(day, month, year);

		db.transaction((txn) => {
			txn.executeSql(
				`SELECT * FROM moonPhase WHERE phase_number = ${moonphase}`,
				[],
				(tx, results) => {
					const res = results.rows.item(0);
					setMoon(res);
				},
			);
		});
	};

	useEffect(() => {
		const getFocus = navigation.addListener('focus', () => {
			getLastScans();
			getArticles();
			isHermes();
			askPerms();
			getMoonPhase();
			refreshConnection();
		});

		return getFocus;
	}, []);

	if (!checkInternet) {
		return (
			<View style={{ backgroundColor: 'white', flex: 1 }}>
				<WeatherCard
					weatherInfo={weather}
					moonInfo={moon}
					getLocation={() => askPerms()}
					weatherLoading={weatherLoading}
				/>
				<View style={{ marginVertical: 40 }}>
					<Text style={{ fontSize: 18, textAlign: 'center' }}>
						Отсутствует подключение к интернету, функциональность приложения ограничена
					</Text>
					<Button
						title="Обновить"
						onPress={() => {
							refreshConnection();
							getArticles();
							askPerms();
							getLastScans();
						}}
					/>
				</View>
			</View>
		);
	}
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
				<WeatherCard
					weatherInfo={weather}
					moonInfo={moon}
					getLocation={() => askPerms()}
					weatherLoading={weatherLoading}
				/>
				{/* FEEDBACK */}
				<FeedBack />
			</ScrollView>
		</View>
	);
};
const mapStateToProps = ({ auth }) => {
	const {
		fistLaunchToken,
		isSigned,
		toSignupScreen,
		toAuthFlow,
		hasInternetConnection,
		checkInternet,
	} = auth;

	return {
		fistLaunchToken,
		isSigned,
		toSignupScreen,
		toAuthFlow,
		hasInternetConnection,
		checkInternet,
	};
};

export default connect(mapStateToProps, { resolveAuth, refreshConnection })(MainScreen);
