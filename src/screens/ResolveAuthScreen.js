/* eslint-disable global-require */
/* import CookieManager from '@react-native-community/cookies'; */
import React from 'react';
import { View, Image, ActivityIndicator } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';

const ResolveAuthScreen = (props) => {
	/* CookieManager.get('https://leafs-app.lab-code.com/').then((cookies) => {
		console.log('CookieManager.get =>', cookies);
	}); */
	RNBootSplash.hide();

	const { loading } = props;

	const Indicator = () => (
		<View style={{ backgroundColor: 'white', position: 'absolute', bottom: 50 }}>
			<ActivityIndicator size="large" color="#379683" style={{ flex: 1 }} />
		</View>
	);

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: 'white',
				alignItems: 'center',
			}}
		>
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<Image
					source={require('../../assets/newBootsplash.png')}
					style={{ width: 100, height: 100 }}
				/>
			</View>
			{loading ? <Indicator /> : null}
		</View>
	);
};

export default ResolveAuthScreen;
