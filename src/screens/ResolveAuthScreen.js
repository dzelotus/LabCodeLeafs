import CookieManager from '@react-native-community/cookies';
import React from 'react';
import { View } from 'react-native';

const ResolveAuthScreen = () => {
	CookieManager.get('https://leafs-app.lab-code.com/').then((cookies) => {
		console.log('CookieManager.get =>', cookies);
	});

	return <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }} />;
};
export default ResolveAuthScreen;
