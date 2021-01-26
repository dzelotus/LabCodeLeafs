/* eslint-disable no-sequences */
/* eslint-disable consistent-return */
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Geolocation from '@react-native-community/geolocation';
import RNBootSplash from 'react-native-bootsplash';

import LastScansCard from '../components/LastScansCard';
import NewsCard from '../components/NewsCard';
import WeatherCard from '../components/WeatherCard';
import nodeApi from '../api/nodeApi';
import weatherApi from '../api/weatherApi';

const MainScreen = ({ navigation }) => {
	const [errorButton, setErrorButton] = useState(true);
	const [scans, setScans] = useState();
	const [verifyToken, setVerifyToken] = useState(true);
	const [weather, setWeather] = useState();
	const [newsData, setNewsData] = useState(null);

	const isHermes = () => !!global.HermesInternal;

	const getLastScans = () => {
		nodeApi
			.get('/scans')
			.then((response) => {
				console.log('SCANS', response.data.data);
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
			.then((response) => setNewsData(response.data.data))
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
			.get('/', {
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
				});
			})
			.catch((error) => console.log('!!!', error.response));
	};

	const checkVerify = () => {
		nodeApi.get('user_authentication').then((response) => {
			console.log('TOKEN', response.data);
			setErrorButton(response.data.data.isVerified);
			setVerifyToken(response.data.hasValidTokens);
		});
	};

	useEffect(() => {
		const getFocus = navigation.addListener('focus', () => {
			getLastScans();
			checkVerify();
			getCoords();
			getArticles();
			isHermes();
		});

		return getFocus;
	}, []);

	const EmailVerify = () => {
		if (!errorButton && !verifyToken) {
			return (
				<TouchableOpacity
					style={styles.errorButton}
					onPress={() =>
						nodeApi
							.post('/verify', {})
							.then((response) => Alert.alert('', response.data.message))
							.catch((error) => {
								console.log(error.response.data.message);
								Alert.alert('', error.response.data.message);
							})
					}
				>
					<FontAwesome name="exclamation-triangle" size={30} color="white" />
				</TouchableOpacity>
			);
		}
		return null;
	};

	const WeatherCardShow = () => {
		if (weather) {
			return <WeatherCard weatherInfo={weather} />;
		}
	};

	return (
		<View style={{ backgroundColor: 'white', flex: 1 }}>
			<ScrollView
				contentContainerStyle={{
					paddingTop: 10,
				}}
			>
				<NewsCard iconName="star-o" nav="News" headerText="Новости" newsData={newsData} />
				<LastScansCard
					headerText="Мои сканирования"
					nav="LastScan"
					iconName="pagelines"
					data={scans}
				/>
				{WeatherCardShow()}
			</ScrollView>
			<EmailVerify />
		</View>
	);
};

const styles = StyleSheet.create({
	errorButton: {
		position: 'absolute',
		justifyContent: 'center',
		alignSelf: 'center',
		alignItems: 'center',
		borderColor: 'red',
		borderWidth: 1,
		borderRadius: 50,
		height: 60,
		width: 60,
		right: 30,
		bottom: -100,
		backgroundColor: 'red',
	},
});

export default MainScreen;
