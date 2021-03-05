import { Text, View } from 'react-native';

import React, { useEffect } from 'react';

const MoonCalendarScreen = (props) => {
	useEffect(() => {
		props.navigation.setOptions({
			headerBackTitle: 'Назад',
		});
	}, []);
	return (
		<View
			style={{
				paddingHorizontal: 5,
				paddingTop: 10,
				paddingBottom: 5,
				backgroundColor: 'white',
				flex: 1,
			}}
		>
			<Text>Здесь будет лунный посевной календарь</Text>
		</View>
	);
};

export default MoonCalendarScreen;
