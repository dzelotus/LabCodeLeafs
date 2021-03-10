import { Text, View, Image, ActivityIndicator, TouchableOpacity } from 'react-native';

import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import nodeApi from '../api/nodeApi';

const { Conway } = require('@lab-code/moonphase');

const MoonCalendarScreen = (props) => {
	const [date, setDate] = useState();
	const [moon, setMoon] = useState();

	moment.updateLocale('ru', {
		months: [
			'Января',
			'Февраля',
			'Марта',
			'Апреля',
			'Мая',
			'Июня',
			'Июля',
			'Августа',
			'Сентября',
			'Октября',
			'Ноября',
			'Декабря',
		],
	});

	const getDate = () => {
		const now = moment();
		const day = now.date();
		const month = now.month() + 1;
		const year = now.year();
		const today = now.locale('ru').format('D MMMM YYYY');

		setDate({ now, day, month, year, today });
		const moonphase = Conway(day, month, year);
		getMoonPhase(moonphase);
	};

	const increaseDate = () => {
		const now = date.now.add(1, 'days');
		const day = now.date();
		const month = now.month() + 1;
		const year = now.year();
		const today = now.locale('ru').format('D MMMM YYYY');

		setDate({ ...date, now, day, month, year, today });
		const moonphase = Conway(day, month, year);
		getMoonPhase(moonphase);
	};

	const decreaseDate = () => {
		const now = date.now.add(-1, 'days');
		const day = now.date();
		const month = now.month() + 1;
		const year = now.year();
		const today = now.locale('ru').format('D MMMM YYYY');

		setDate({ ...date, now, day, month, year, today });
		const moonphase = Conway(day, month, year);
		getMoonPhase(moonphase);
	};
	const getMoonPhase = (moonphase) => {
		nodeApi
			.get(`/garden-calendar/moon-phase-calendar/${moonphase}`)
			.then((response) => {
				/* console.log('MOON RESP', response.data); */
				setMoon(response.data.data);
			})
			.catch(() => /* console.log('MOON ERR', error) */ null);
	};

	const Indicator = () => (
		<View
			style={{
				backgroundColor: 'white',
				flex: 1,
			}}
		>
			<ActivityIndicator size="large" color="#379683" style={{ flex: 1 }} />
		</View>
	);

	console.log('MOON', moon);

	useEffect(() => {
		getDate();
		props.navigation.setOptions({
			headerBackTitle: 'Назад',
		});
	}, []);

	if (!moon) {
		return <Indicator />;
	}
	return (
		<View
			style={{
				paddingHorizontal: 10,
				paddingTop: 10,
				paddingBottom: 5,
				backgroundColor: 'white',
				flex: 1,
			}}
		>
			<View>
				<Text
					style={{
						fontSize: 20,
						color: '#EB9156',
						textAlign: 'center',
						marginVertical: 10,
					}}
				>
					{date.today}
				</Text>
				<View
					style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
				>
					<TouchableOpacity
						onPress={() => {
							decreaseDate();
						}}
					>
						<Icon name="chevron-thin-left" size={50} color="#EB9156" />
					</TouchableOpacity>
					<Image
						style={{ width: 150, height: 150, marginHorizontal: 20 }}
						source={{ uri: moon.phase_image_url }}
					/>
					<TouchableOpacity
						onPress={() => {
							increaseDate();
						}}
					>
						<Icon name="chevron-thin-right" size={50} color="#EB9156" />
					</TouchableOpacity>
				</View>
				<Text
					style={{ fontSize: 18, color: '#379683', textAlign: 'center', marginTop: 10 }}
				>
					{moon.phase_description}
				</Text>
			</View>
		</View>
	);
};

export default MoonCalendarScreen;
