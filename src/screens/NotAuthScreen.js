/* Экран не зарегистрированного пользователя, появляется в случае отсутствия авторизации в приложении */

import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { resolveAuth } from '../actions/AuthActions';

const NotAuthUserScreen = (props) => {
	console.log(props);

	return (
		<View style={{ backgroundColor: 'white', flex: 1, justifyContent: 'center' }}>
			<Text style={{ fontSize: 18, textAlign: 'center' }}>
				Данный раздел доступен только для зарегистрированных пользователей
			</Text>
			<View style={{ flexDirection: 'row' }}>
				<TouchableOpacity
					style={styles.buttonStyle}
					onPress={() => {
						props.resolveAuth({ prop: 'toAuthFlow', value: true });
						props.resolveAuth({ prop: 'toSignupScreen', value: false });
					}}
				>
					<View>
						<Text style={{ fontSize: 16, color: '#EB9156' }}>Войти</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.buttonStyle}
					onPress={() => {
						props.resolveAuth({ prop: 'toAuthFlow', value: true });
						props.resolveAuth({ prop: 'toSignupScreen', value: true });
					}}
				>
					<View>
						<Text style={{ fontSize: 16, color: '#EB9156' }}>Зарегистрироваться</Text>
					</View>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	errorMessage: {
		fontSize: 16,
		color: 'red',
		marginLeft: 15,
		textAlign: 'center',
	},
	buttonStyle: {
		marginHorizontal: 5,
		marginVertical: 10,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		borderRadius: 10,
		borderColor: '#379683',
		borderWidth: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		height: 50,
		justifyContent: 'center',
		flex: 1,
	},
});

const mapStateToProps = ({ auth }) => {
	const { toSignupScreen, toAuthFlow } = auth;

	return { toSignupScreen, toAuthFlow };
};

export default connect(mapStateToProps, { resolveAuth })(NotAuthUserScreen);
