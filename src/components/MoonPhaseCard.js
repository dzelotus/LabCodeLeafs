import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import FastImage from 'react-native-fast-image';

import moonImageSwitch from '../assets/moonIcon';

const { Conway } = require('@lab-code/moonphase');

const MoonPhaseCard = () => {
	const [date, setDate] = useState();

	useEffect(() => {
		const now = moment();
		getDate(now);
	}, []);

	const getDate = (now) => {
		const day = now.date();
		const month = now.month() + 1;
		const year = now.year();
		const today = now.locale('ru').format('D MMMM YYYY');
		const moonphase = Conway(day, month, year);

		setDate({ now, day, month, year, today, moonphase });
	};

	console.log('DATE', date);

	if (!date) {
		return null;
	}

	return (
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
			<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
				<TouchableOpacity
					onPress={() => {
						const changeNow = date.now.add(-1, 'days');
						getDate(changeNow);
					}}
				>
					<Icon name="chevron-thin-left" size={50} color="#EB9156" />
				</TouchableOpacity>
				<FastImage
					style={{ width: 150, height: 150, marginHorizontal: 20 }}
					source={moonImageSwitch(date.moonphase.toString())}
				/>

				<TouchableOpacity
					onPress={() => {
						const changeNow = date.now.add(1, 'days');
						getDate(changeNow);
					}}
				>
					<Icon name="chevron-thin-right" size={50} color="#EB9156" />
				</TouchableOpacity>
			</View>
			{/* <Text
				style={{
					textAlign: 'center',
					fontSize: 20,
					marginVertical: 10,
					color: '#EB9156',
				}}
			>
				{moon.phase_name}
			</Text> */}
		</View>
	);
};

export default MoonPhaseCard;
