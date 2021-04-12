import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

import FastImage from 'react-native-fast-image';

import moonImageSwitch from '../assets/moonIcon';

const MoonPhaseCard = ({ getDateFunc, date }) => {
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
						getDateFunc(changeNow);
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
						getDateFunc(changeNow);
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
