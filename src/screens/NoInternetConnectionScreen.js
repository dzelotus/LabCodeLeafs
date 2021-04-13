/* eslint-disable global-require */
import React from 'react';
import { View, Text, Button, Image } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import { connect } from 'react-redux';
import { resolveInternet } from '../actions/AuthActions';

const NoInternetConnectionScreen = (props) => {
	const { resolveInternet } = props;
	RNBootSplash.hide();

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
			<View style={{ position: 'absolute', bottom: 100 }}>
				<Text>Отсутствует подключение к интернету</Text>
				<Button
					title="Продолжить?"
					onPress={() => {
						resolveInternet(true);
					}}
				/>
			</View>
		</View>
	);
};

const mapStateToProps = ({ auth }) => {
	const { fistLaunchToken, isSigned, startWithoutInternet } = auth;

	return { fistLaunchToken, isSigned, startWithoutInternet };
};

export default connect(mapStateToProps, { resolveInternet })(NoInternetConnectionScreen);
