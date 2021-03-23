import { Text, View, ScrollView, ActivityIndicator, Image, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';

import imageSwitch from '../assets/weatherIcon';
import weatherApi from '../api/weatherApi';

const WeatherScreen = (props) => {
	const { route } = props;
	const { lat, lon } = route.params.coords;
	const [weather, setWeather] = useState(null);
	const [loading, setLoading] = useState(false);

	const checkWeather = (lon, lat) => {
		setLoading(true);
		weatherApi
			.get('/onecall', {
				params: {
					lon,
					lat,
					units: 'metric',
					lang: 'ru',
					exclude: 'minutely,hourly,alerts,current',
					appid: '8da265f8c41094bc3f5222f1837a983c',
				},
			})
			.then((info) => {
				const dailyWeather = info.data.daily;
				setWeather(dailyWeather);
				setLoading(false);
			})
			.catch((error) => {
				console.log('!!!', error.response);
				setLoading(false);
			});
	};
	/* 
	const checkWeather2 = (lon, lat) => {
		weatherApi
			.get('/forecast', {
				params: {
					lon,
					lat,
					units: 'metric',
					lang: 'ru',
					appid: '8da265f8c41094bc3f5222f1837a983c',
				},
			})
			.then((info) => {
				const dataForMap = info.data.list;
				console.log('DATA FOR MAP', info.data.list);
			})
			.catch((err) => console.log(err));
	}; */

	const TempRow = ({ temp }) => {
		return (
			<View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
				<Text style={{ fontSize: 22, color: '#EB9156' }}>{temp}</Text>
				<Icon
					name="circle-o"
					size={6}
					color="#EB9156"
					style={{ marginTop: 3, marginLeft: 3 }}
				/>
			</View>
		);
	};

	const Weath = () => {
		if (weather) {
			return weather.map((item) => {
				console.log('ITEM', item);
				const date = new Date(item.dt * 1000);
				const readyDate = moment(date).format('DD MMMM, dddd');
				const dayTemp = Number.parseInt(item.temp.day, 10);
				const eveTemp = Number.parseInt(item.temp.eve, 10);
				const mornTemp = Number.parseInt(item.temp.morn, 10);
				const nightTemp = Number.parseInt(item.temp.night, 10);
				const weatherIcon = item.weather[0].icon;

				return (
					<View key={item.dt} style={{ paddingBottom: 15 }}>
						<Text>{readyDate}</Text>
						<View style={{ flexDirection: 'row', flex: 1, marginVertical: 10 }}>
							<Image
								source={imageSwitch(weatherIcon)}
								resizeMode="contain"
								resizeMethod="resize"
								style={{ width: 75, height: 75 }}
							/>
							<View style={{ flex: 1 }}>
								<View style={{ flexDirection: 'row', flex: 1 }}>
									<Text
										style={{
											flex: 1,
											textAlign: 'center',
											textAlignVertical: 'bottom',
											fontSize: 16,
										}}
									>
										Утро
									</Text>
									<Text
										style={{
											flex: 1,
											textAlign: 'center',
											textAlignVertical: 'bottom',
											fontSize: 16,
										}}
									>
										День
									</Text>
									<Text
										style={{
											flex: 1,
											textAlign: 'center',
											textAlignVertical: 'bottom',
											fontSize: 16,
										}}
									>
										Вечер
									</Text>
									<Text
										style={{
											flex: 1,
											textAlign: 'center',
											textAlignVertical: 'bottom',
											fontSize: 16,
										}}
									>
										Ночь
									</Text>
								</View>

								<View
									style={{
										flexDirection: 'row',
										alignContent: 'center',
										flex: 1,
										fontSize: 16,
									}}
								>
									<TempRow temp={mornTemp} />
									<TempRow temp={dayTemp} />
									<TempRow temp={eveTemp} />
									<TempRow temp={nightTemp} />
								</View>
							</View>
						</View>
						<Text>{item.weather[0].description}</Text>
					</View>
				);
			});
		}
		return null;
	};

	const Indicator = () => (
		<View style={{ flex: 1, backgroundColor: 'white' }}>
			<ActivityIndicator size="large" color="#379683" style={{ flex: 1 }} />
		</View>
	);

	useEffect(() => {
		checkWeather(lon, lat);

		props.navigation.setOptions({
			headerBackTitle: 'Назад',
		});
	}, []);

	if (loading) {
		return <Indicator />;
	}
	const marg = Platform.OS === 'ios' ? 30 : 0;
	return (
		<View style={{ flex: 1, backgroundColor: 'white' }}>
			<ScrollView
				style={{
					paddingHorizontal: 15,
					paddingTop: 10,
					marginBottom: marg,
					flex: 1,
					backgroundColor: 'white',
				}}
			>
				<Weath />
			</ScrollView>
		</View>
	);
};

export default WeatherScreen;
