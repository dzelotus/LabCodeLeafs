import React from 'react';
import { View, Text, Image } from 'react-native';

import CookieManager from '@react-native-community/cookies';

const ResolveAuthScreen = () => {
	CookieManager.get('https://leafs-app.lab-code.com/').then((cookies) => {
		console.log('CookieManager.get =>', cookies);
	});

	return <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}></View>;
};
export default ResolveAuthScreen;
