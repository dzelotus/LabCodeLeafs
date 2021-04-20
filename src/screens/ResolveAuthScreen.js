/* eslint-disable global-require */
/* import CookieManager from '@react-native-community/cookies'; */
import React from 'react';
import { View, Image, ActivityIndicator } from 'react-native';

import { connect } from 'react-redux';

const ResolveAuthScreen = (props) => {
	/* 	CookieManager.get('https://leafs-app.lab-code.com/').then((cookies) => {
		console.log('CookieManager.get =>', cookies);
	}); */

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

const mapStateToProps = ({ auth }) => {
	const { loading } = auth;

	return {
		loading,
	};
};

export default connect(mapStateToProps, {})(ResolveAuthScreen);
