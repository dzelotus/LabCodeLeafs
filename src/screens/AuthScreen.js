/* eslint-disable global-require */
import { Image, StyleSheet, View } from 'react-native';
import React, { useEffect } from 'react';

import { Button } from 'react-native-elements';
import RNBootSplash from 'react-native-bootsplash';

const AuthScreen = ({ navigation }) => {
	useEffect(() => {
		RNBootSplash.hide();
	});

	return (
		<View style={{ flex: 1, alignItems: 'center' }}>
			<View style={styles.container}>
				<Image source={require('../../assets/plant_logo.png')} style={styles.imageStyle} />
				<View style={{ marginVertical: 15 }}>
					<Button
						title="Войти"
						onPress={() => navigation.navigate('Signin')}
						raised
						buttonStyle={{
							backgroundColor: '#8DC34A',
							paddingBottom: 15,
						}}
					/>
				</View>
				<View style={{ marginTop: 5 }}>
					<Button
						title="Зарегистрироваться"
						onPress={() => navigation.navigate('Signup')}
						raised
						buttonStyle={{ backgroundColor: '#8DC34A' }}
					/>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		width: 300,
		alignContent: 'center',
	},

	button: {
		borderColor: 'red',
		borderWidth: 1,
		margin: 10,
		borderRadius: 15,
		height: 50,
		justifyContent: 'center',
	},
	text: {
		fontSize: 22,
		alignSelf: 'center',
		textAlign: 'center',
	},
	imageStyle: {
		height: 120,
		width: 120,
		alignSelf: 'center',
		marginVertical: 15,
	},
});

export default AuthScreen;
