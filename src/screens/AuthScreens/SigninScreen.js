/* eslint-disable global-require */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-else-return */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-no-bind */

/*  Экран входа в приложение */

import {
	ActivityIndicator,
	Alert,
	Modal,
	ScrollView,
	StatusBar,
	StyleSheet,
	TouchableOpacity,
	View,
	Image,
} from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import React, { useEffect, useRef, useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import RNBootSplash from 'react-native-bootsplash';
import {
	clearErrorMessage,
	getCsrf,
	inputChange,
	signin,
	checkBioScanner,
	resolveAuth,
} from '../../actions/AuthActions';

import nodeApi from '../../api/nodeApi';

function SigninScreen(props) {
	const [isModalVisible, setModalVisible] = useState(false);
	const [regexEmail, setRegexEmail] = useState();
	const [indicator, setIndicator] = useState(false);

	const regexUsername = useRef();
	const regexPassword = useRef();
	const activeButton = useRef(true);

	const {
		email,
		username,
		password,
		error,
		navigation,
		_csrf,
		hasBioScanner,
		isBioAuthActive,
	} = props;

	const toggleModal = () => {
		setModalVisible(!isModalVisible);
	};

	useEffect(() => {
		console.log('ЛОГИН СРАБОТКА');
		props.getCsrf();
		RNBootSplash.hide();
		props.checkBioScanner();
		isBioAuthActive ? fingerprintLogin() : null;
		props.navigation.setOptions({
			headerBackTitle: 'Назад',
		});
		/* AsyncStorage.removeItem('BioAuth'); */
	}, []);

	const fingerprintLogin = () => {
		console.log('ITS CSRF', _csrf);
		AsyncStorage.getItem('BioAuth').then((resp) => {
			const response = JSON.parse(resp);
			console.log('TEST', response);
			if (response) {
				FingerprintScanner.authenticate({ title: 'Войти в приложение' })
					.then(() => {
						console.log('TRY TRY CATCH', response);
						onButtonPress({
							username: response.username,
							password: response.password,
						});
						FingerprintScanner.release();
					})
					.catch((error) => {
						console.log('Отмена активации', error);
						FingerprintScanner.release();
					});
			} else {
				return null;
			}
		});
	};

	const onButtonPress = ({ username, password }) => {
		console.log('LOGIN', _csrf);
		props.signin({
			username,
			password,
			_csrf,
		});
	};

	const activityIndicator = () => {
		if (!_csrf) {
			return (
				<View>
					<ActivityIndicator size="large" color="#379683" />
				</View>
			);
		} else if (hasBioScanner && isBioAuthActive) {
			return (
				<View style={{ flexDirection: 'row' }}>
					<Button
						containerStyle={{ paddingHorizontal: 8, flex: 3 }}
						buttonStyle={{ backgroundColor: '#379683', height: 40 }}
						title="Войти"
						onPress={() => onButtonPress({ username, password })}
						disabled={activeButton.current}
					/>
					<Button
						containerStyle={{ paddingHorizontal: 8, flex: 1, height: 60 }}
						buttonStyle={{ backgroundColor: '#379683', height: 40 }}
						icon={<Icon name="finger-print" size={20} color="black" />}
						onPress={() => fingerprintLogin()}
					/>
				</View>
			);
		} else {
			return (
				<Button
					containerStyle={{ paddingHorizontal: 8 }}
					buttonStyle={{ backgroundColor: '#379683' }}
					title="Войти"
					onPress={() => onButtonPress({ username, password })}
					disabled={activeButton.current}
				/>
			);
		}
	};

	const activityIndicatorModal = () => {
		if (indicator) {
			return (
				<View>
					<ActivityIndicator size="large" color="#379683" />
				</View>
			);
		}
		return (
			<Button
				title="Отправить запрос"
				raised="true"
				buttonStyle={{
					borderColor: '#379683',
					height: 48,
					borderWidth: 2,
					backgroundColor: '#fff',
				}}
				titleStyle={{ color: '#EB9156' }}
				onPress={() => {
					setIndicator(true);
					nodeApi
						.post('/password-recovery', {
							email,
							_csrf: props._csrf,
						})
						.then((response) => {
							console.log(response);
							if (response.data.success === true) {
								Alert.alert('', response.data.message);
								toggleModal();
							} else {
								Alert.alert('', response.data.message);
							}
							setIndicator(false);
						})
						.catch((e) => {
							console.log('ERR', e.response);
							setIndicator(false);
						});
				}}
			/>
		);
	};

	if (username && password && !regexPassword.current && !regexUsername.current) {
		activeButton.current = false;
	} else {
		activeButton.current = true;
	}

	const errorMessage = () => {
		if (error) {
			return <Text>{error}</Text>;
		}
	};

	navigation.addListener('focus', () => {
		props.clearErrorMessage();
	});

	const regex = {};

	const validateUsername = (username) => {
		regex.username = /^[a-zA-Z0-9]+$/;
		return regex.username.test(username);
	};
	const validatePassword = (password) => {
		regex.password = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/;
		return regex.password.test(password);
	};

	const validateEmail = (email) => {
		regex.email = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
		return regex.email.test(email);
	};

	console.log('PROPS', props);

	return (
		<View
			style={{
				paddingTop: StatusBar.currentHeight,
				justifyContent: 'center',
			}}
		>
			<ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="always">
				<Image
					source={require('../../../assets/firstLaunchScreenImages/bitmap.png')}
					style={{ width: 350, height: 60, marginTop: 15, alignSelf: 'center' }}
					resizeMode="contain"
				/>
				<Text h3 style={{ alignSelf: 'center', marginTop: 10, color: '#EB9156' }}>
					Вход
				</Text>

				<View style={styles.inputsContainer}>
					<Input
						accessibilityLabel="E-mail for login"
						accessibilityHint="Login E-mail"
						inputStyle={{ height: 50 }}
						label="Имя пользователя"
						labelStyle={{ color: '#379683' }}
						autoCapitalize="none"
						autoCorrect={false}
						value={username}
						onChangeText={(text) => {
							props.inputChange({
								prop: 'username',
								value: text,
							});

							if (validateUsername(text) && text.length > 2 && text.length < 51) {
								regexUsername.current = '';
							} else {
								regexUsername.current =
									'Имя пользователя должно быть длиннее двух символов и может содержать только буквы латинского алфавита и цифры';
							}
						}}
						errorStyle={{ color: 'red' }}
						errorMessage={regexUsername.current}
					/>

					<Input
						accessibilityLabel="Password for login"
						accessibilityHint="Login Password"
						inputStyle={{ height: 50 }}
						secureTextEntry
						label="Пароль"
						labelStyle={{ color: '#379683' }}
						autoCapitalize="none"
						autoCorrect={false}
						value={password}
						onChangeText={(text) => {
							props.inputChange({
								prop: 'password',
								value: text,
							});
							if (validatePassword(text) && text.length > 7 && text.length < 51) {
								regexPassword.current = '';
							} else {
								regexPassword.current =
									'Пароль должен быть длиннее 7 символов, содержать цифры и хотя бы одну букву латинского алфавита';
							}
						}}
						errorStyle={{ color: 'red' }}
						errorMessage={regexPassword.current}
					/>

					{activityIndicator()}
					{errorMessage()}
					<TouchableOpacity
						style={{
							alignSelf: 'center',
							marginTop: 20,
							borderBottomWidth: 2,
							borderBottomColor: '#379683',
						}}
						onPress={toggleModal}
					>
						<Text style={{ fontSize: 18, color: '#379683' }}>Забыл пароль?</Text>
					</TouchableOpacity>
				</View>

				<TouchableOpacity
					style={{
						alignSelf: 'center',
						marginTop: 20,
						borderBottomWidth: 2,
						borderBottomColor: '#379683',
					}}
					onPress={() => {
						navigation.navigate('Signup');
					}}
				>
					<Text style={{ fontSize: 15, color: '#379683' }}>
						Перейти на экран регистрации
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						alignSelf: 'center',
						marginVertical: 20,
						borderBottomWidth: 2,
						borderBottomColor: '#379683',
					}}
					onPress={() => {
						AsyncStorage.setItem('alreadyLaunched', 'true');
						props.resolveAuth({ prop: 'toAuthFlow', value: false });
					}}
				>
					<Text style={{ fontSize: 16, color: '#EB9156' }}>
						Продолжить без регистрации
					</Text>
				</TouchableOpacity>
			</ScrollView>
			<Modal visible={isModalVisible} animationType="slide" transparent>
				<View style={styles.modalContainer}>
					<TouchableOpacity
						onPress={toggleModal}
						style={{ alignSelf: 'flex-end', marginBottom: 10 }}
					>
						<MaterialCommunityIcons name="close" size={48} />
					</TouchableOpacity>
					<Text
						style={{
							textAlign: 'center',
							fontSize: 16,
							marginBottom: 10,
						}}
					>
						Для восстановления пароля введите адрес электронной почты!
					</Text>
					<Input
						inputStyle={{ height: 50 }}
						labelStyle={{ color: '#379683' }}
						accessibilityLabel="Reset Password"
						accessibilityHint="Pass email to restore password"
						label="E-mail"
						autoCapitalize="none"
						autoCorrect={false}
						value={email}
						onChangeText={(text) => {
							props.inputChange({
								prop: 'email',
								value: text,
							});
						}}
						onBlur={() => {
							if (validateEmail(email)) {
								setRegexEmail();
							} else {
								setRegexEmail('Некорректный емейл');
							}
						}}
						errorStyle={{ color: 'red' }}
						errorMessage={regexEmail}
					/>
					{activityIndicatorModal()}
				</View>
			</Modal>
		</View>
	);
}

SigninScreen.navigationOptions = () => ({
	headerShown: false,
});

const mapStateToProps = ({ auth }) => {
	const {
		username,
		password,
		email,
		loading,
		error,
		_csrf,
		isSigned,
		hasBioScanner,
		isBioAuthActive,
	} = auth;

	return {
		username,
		password,
		email,
		loading,
		error,
		_csrf,
		isSigned,
		hasBioScanner,
		isBioAuthActive,
	};
};

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		justifyContent: 'center',
		paddingTop: 50,
	},
	inputsContainer: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		borderRadius: 5,
		borderColor: '#000',
		backgroundColor: '#fff',
		paddingVertical: 20,
		paddingHorizontal: 10,
		margin: 10,
	},
	modalContainer: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 5,
		padding: 15,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		height: 320,
		marginTop: 120,
	},
});

export default connect(mapStateToProps, {
	inputChange,
	signin,
	clearErrorMessage,
	getCsrf,
	checkBioScanner,
	resolveAuth,
})(SigninScreen);
