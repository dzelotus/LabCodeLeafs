import { Text, View, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';

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

	const TempRow = ({ temp }) => {
		return (
			<View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
				<Text style={{ fontSize: 18, color: '#EB9156' }}>{temp}</Text>
				<Icon name="circle-o" size={8} color="#EB9156" />
				<Text
					style={{
						textAlignVertical: 'center',
						fontSize: 18,
						color: '#EB9156',
					}}
				>
					С
				</Text>
			</View>
		);
	};

	const Weath = () => {
		if (weather) {
			return weather.map((item) => {
				console.log('ITEM', item);
				const date = new Date(item.dt * 1000);
				const readyDate = moment(date).format('DD MMMM');
				const dayTemp = Number.parseInt(item.temp.day, 10);
				const eveTemp = Number.parseInt(item.temp.eve, 10);
				const mornTemp = Number.parseInt(item.temp.morn, 10);
				const nightTemp = Number.parseInt(item.temp.night, 10);

				return (
					<View key={item.dt} style={{ marginBottom: 10 }}>
						<Text>{readyDate}</Text>
						<View style={{ flexDirection: 'row' }}>
							<Text style={{ flex: 1, textAlign: 'center' }}>Утро</Text>
							<Text style={{ flex: 1, textAlign: 'center' }}>День</Text>
							<Text style={{ flex: 1, textAlign: 'center' }}>Вечер</Text>
							<Text style={{ flex: 1, textAlign: 'center' }}>Ночь</Text>
						</View>
						<View style={{ flexDirection: 'row', alignContent: 'center' }}>
							<TempRow temp={dayTemp} />
							<TempRow temp={eveTemp} />
							<TempRow temp={mornTemp} />
							<TempRow temp={nightTemp} />
						</View>
						<Text>{item.weather[0].description}</Text>
					</View>
				);
			});
		}
		return null;
	};

	const Indicator = () => (
		<View>
			<ActivityIndicator size="large" color="#379683" />
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
	return (
		<ScrollView
			style={{
				paddingHorizontal: 5,
				paddingTop: 10,
				paddingBottom: 5,
				flex: 1,
				backgroundColor: 'white',
			}}
		>
			<Weath />
		</ScrollView>
	);
};

export default WeatherScreen;
