import {
	ActivityIndicator,
	Alert,
	Modal,
	ScrollView,
	StatusBar,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import React, { useEffect, useRef, useState } from 'react';
import { clearErrorMessage, getCsrf, inputChange, signin } from '../actions/AuthActions';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Spacer from '../components/Spacer';
import { connect } from 'react-redux';
import nodeApi from '../api/nodeApi';

function SigninScreen(props) {
	const [isModalVisible, setModalVisible] = useState(false);
	const [regexEmail, setRegexEmail] = useState();
	const [indicator, setIndicator] = useState(false);

	const regexUsername = useRef();
	const regexPassword = useRef();
	const activeButton = useRef(true);

	console.log(props.loading);

	const toggleModal = () => {
		setModalVisible(!isModalVisible);
	};
	const onButtonPress = () => {
		const { username, password, _csrf, email } = props;

		props.signin({ username, password, _csrf, email });
	};

	const activityIndicator = () => {
		if (props.loading) {
			return (
				<View>
					<ActivityIndicator size={'large'} color="#8DC34A" />
				</View>
			);
		} else {
			return (
				<Button
					containerStyle={{ paddingHorizontal: 8 }}
					buttonStyle={{ backgroundColor: '#8DC34A' }}
					title="Войти"
					onPress={onButtonPress.bind(this)}
					disabled={activeButton.current}
				/>
			);
		}
	};

	const activityIndicatorModal = () => {
		if (indicator) {
			return (
				<View>
					<ActivityIndicator size={'large'} color="#8DC34A" />
				</View>
			);
		} else {
			return (
				<Button
					title="Отправить запрос"
					buttonStyle={{ backgroundColor: '#8DC34A' }}
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
							.catch((error) => {
								console.log('ERR', error.response);
								setIndicator(false);
							});
					}}
				/>
			);
		}
	};

	if (props.username && props.password && !regexPassword.current && !regexUsername.current) {
		activeButton.current = false;
	} else {
		activeButton.current = true;
	}

	const error = () => {
		if (props.error) {
			return <Text>{props.error}</Text>;
		}
	};

	const getCsrf = () => {
		nodeApi
			.get('/login')
			.then(
				(response) => (
					console.log(response),
					props.getCsrf({
						prop: '_csrf',
						value: response.data.csrfToken,
					})
				),
			)
			.catch((error) => console.log('ERR', error.response));
	};

	const focus = props.navigation.addListener('focus', () => {
		props.clearErrorMessage();
	});

	useEffect(() => {
		getCsrf();
	}, []);

	const email = props.email;

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

	return (
		<View
			style={{
				paddingTop: StatusBar.currentHeight,
				justifyContent: 'center',
			}}>
			<ScrollView
				contentContainerStyle={styles.container}
				keyboardShouldPersistTaps={'always'}>
				<Spacer>
					<Text h3 style={{ alignSelf: 'center', marginTop: 10 }}>
						Вход в Листочки
					</Text>
				</Spacer>
				<Spacer>
					<View style={styles.inputsContainer}>
						<Input
							label="Имя пользователя"
							autoCapitalize="none"
							autoCorrect={false}
							value={props.username}
							onChangeText={(text) => {
								props.inputChange({
									prop: 'username',
									value: text,
								});

								if (validateUsername(text) && text.length > 2 && text.length < 51) {
									regexUsername.current = '';
								} else {
									regexUsername.current =
										'Логин может содержать только буквы и цифры';
								}
							}}
							errorStyle={{ color: 'red' }}
							errorMessage={regexUsername.current}
						/>

						<Input
							secureTextEntry
							label="Пароль"
							autoCapitalize="none"
							autoCorrect={false}
							value={props.password}
							onChangeText={(text) => {
								props.inputChange({
									prop: 'password',
									value: text,
								});
								if (validatePassword(text) && text.length > 7 && text.length < 51) {
									regexPassword.current = '';
								} else {
									regexPassword.current = 'Пароль должен содержать цифры и буквы';
								}
							}}
							errorStyle={{ color: 'red' }}
							errorMessage={regexPassword.current}
						/>

						{activityIndicator()}
						{error()}
						<TouchableOpacity
							style={{
								alignSelf: 'center',
								marginTop: 20,
								borderBottomWidth: 1,
							}}
							onPress={toggleModal}>
							<Text>Забыл пароль?</Text>
						</TouchableOpacity>
					</View>
				</Spacer>
			</ScrollView>

			<Modal visible={isModalVisible} animationType="slide" transparent={true}>
				<View style={styles.modalContainer}>
					<TouchableOpacity
						onPress={toggleModal}
						style={{ alignSelf: 'flex-end', marginBottom: 10 }}>
						<MaterialCommunityIcons name="close" size={35} />
					</TouchableOpacity>
					<Text
						style={{
							textAlign: 'center',
							fontSize: 16,
							marginBottom: 10,
						}}>
						Для восстановления пароля введите адрес электронной почты!
					</Text>
					<Input
						label="E-mail"
						autoCapitalize="none"
						autoCorrect={false}
						value={props.email}
						onChangeText={(text) => {
							props.inputChange({
								prop: 'email',
								value: text,
							});
						}}
						onBlur={() => {
							console.log('BLUR');
							if (validateEmail(props.email)) {
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

SigninScreen.navigationOptions = () => {
	return {
		headerShown: false,
	};
};

const mapStateToProps = ({ auth }) => {
	const { username, password, email, loading, error, _csrf, isSigned, loadStart } = auth;

	return {
		username,
		password,
		email,
		loading,
		error,
		_csrf,
		isSigned,
		loadStart,
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
			height: 12,
		},
		shadowOpacity: 0.58,
		shadowRadius: 16.0,

		elevation: 3,
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
})(SigninScreen);
