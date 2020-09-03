import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';

import FavoritesCard from '../components/FavoritesCard';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Geolocation from '@react-native-community/geolocation';
import LastScansCard from '../components/LastScansCard';
import RNBootSplash from 'react-native-bootsplash';
import WeatherCard from '../components/WeatherCard';
import nodeApi from '../api/nodeApi';
import weatherApi from '../api/weatherApi';

const MainScreen = (route) => {
	/*const verify = route.navigation.state.params.verify;*/
	const [errorButton, setErrorButton] = useState(true);
	const [scans, setScans] = useState();
	const [verifyToken, setVerifyToken] = useState(true);
	const [weather, setWeather] = useState();

	const getCoords = async () =>
		await Geolocation.getCurrentPosition(
			(info) => {
				checkWeather({ lon: info.coords.longitude, lat: info.coords.latitude });
			},
			(e) => {
				console.log(e);
			},
			{ timeout: 20000 },
		);

	const checkWeather = ({ lon, lat }) => {
		console.log('WEATHER COORDS', lon, lat);
		weatherApi
			.get('/', {
				params: {
					lon: lon,
					lat: lat,
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

	/* const checkWeatherEmu = () => {
		weatherApi
			.get('/', {
				params: {
					q: 'Perm',
					appid: '8da265f8c41094bc3f5222f1837a983c',
					lang: 'ru',
					units: 'metric',
				},
			})
			.then((info) => {
				console.log(info.data);
				setWeather({
					description: info.data.weather[0].description,
					icon: info.data.weather[0].icon,
					temp: info.data.main.temp,
					location: info.data.name,
				});
			})
			.catch((error) => console.log(error.response));
	}; */

	const checkVerify = () => {
		nodeApi
			.get(
				'f54ji0eyEmOsOweSpErOsT1poph4nebo4EbubR5SplS2Ly1fim70lwLroCHu5oho/user_authentication',
			)
			.then((response) => {
				console.log(response.data);
				setErrorButton(response.data.data.isVerified);
				setVerifyToken(response.data.hasValidTokens);
			});
	};

	useEffect(() => {
		getCoords();
		/* checkWeatherEmu(); */
	}, []);

	route.navigation.addListener('focus', () => {
		checkVerify();
		getLastScans();
	});

	const getLastScans = () => {
		nodeApi
			.get('/scans')
			.then((response) => {
				let startArray = response.data.data.reverse();
				let data = startArray.slice(0, 9);
				setScans(data);
			})
			.catch((error) => console.log(error.response));
		RNBootSplash.hide();
	};

	const EmailVerify = () => {
		if (!errorButton && !verifyToken) {
			console.log('!!!!');
			return (
				<TouchableOpacity
					style={styles.errorButton}
					onPress={() =>
						nodeApi
							.post('/verify', {})
							.then((response) => Alert.alert(response.data.message))
							.catch((error) => console.log(error.response))
					}>
					<FontAwesome name="exclamation-triangle" size={30} color="white" />
				</TouchableOpacity>
			);
		} else {
			return <Text />;
		}
	};

	const WeatherCardShow = () => {
		if (weather) {
			return <WeatherCard weatherInfo={weather} />;
		}
	};

	return (
		<View>
			<ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: 15 }}>
				<FavoritesCard
					iconName="star-o"
					nav="Favorites"
					headerText="Мои растения"
					itemText="мои растения"
				/>

				<LastScansCard
					headerText="Последние сканирования"
					nav="LastScan"
					iconName="pagelines"
					data={scans}
				/>
				{WeatherCardShow()}
			</ScrollView>

			{EmailVerify()}
		</View>
	);
};

const styles = StyleSheet.create({
	errorButton: {
		position: 'absolute',
		justifyContent: 'flex-end',
		alignSelf: 'center',
		alignItems: 'center',
		borderColor: 'red',
		justifyContent: 'center',
		borderWidth: 1,
		borderRadius: 50,
		height: 60,
		width: 60,
		right: 30,
		bottom: 30,
		backgroundColor: 'red',
	},
});

export default MainScreen;
