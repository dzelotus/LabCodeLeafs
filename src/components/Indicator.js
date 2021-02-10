import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const Indicator = ({ style }) => {
	return (
		<View style={style}>
			<ActivityIndicator size="large" color="#379683" />
		</View>
	);
};

export default Indicator;
