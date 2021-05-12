/* eslint-disable global-require */
/* eslint-disable no-useless-escape */
/* eslint-disable react/jsx-no-bind */

/* Экран регистрации в приложении */

/* NPM */
import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
	View,
	KeyboardAvoidingView,
	ScrollView,
	StyleSheet,
	Modal,
	TouchableOpacity,
	Platform,
	Image,
} from 'react-native';
import { Text, Button, Input } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import AsyncStorage from '@react-native-community/async-storage';
import RNBootSplash from 'react-native-bootsplash';

/* OTHER */
import {
	inputChange,
	signup,
	clearErrorMessage,
	getCsrf,
	activateBioAuth,
	checkBioScanner,
	resolveAuth,
} from '../../actions/AuthActions';
import Indicator from '../../components/Indicator';

function SignupScreen(props) {
	const regexUsername = useRef();
	const regexPassword = useRef();
	const regexPassword2 = useRef();
	const activeButton = useRef(true);
	const [regexEmail, setRegexEmail] = useState();
	const [isModalVisible, setModalVisible] = useState(false);

	const { username, password, password2, email, navigation, _csrf } = props;

	useEffect(() => {
		console.log('THIS SIGNUP SCREEN');
		props.getCsrf();
		RNBootSplash.hide();
		props.checkBioScanner();
	}, []);

	const onButtonPress = () => {
		AsyncStorage.getItem('BioAuth').then((resp) => {
			console.log(resp);
			if (resp) {
				setModalVisible(true);
			} else {
				props.signup({ username, email, password, _csrf });
			}
		});

		/* props.signup({ username, email, password, _csrf }); */
	};

	const changeBioAuthUser = () => {
		console.log('CHANGE', username);
		FingerprintScanner.authenticate({
			title: 'Активировать биометрическую аутентификацию для другого пользователя?',
			cancelButton: 'Отмена',
		})
			.then(() => {
				props.signup({ username, email, password, _csrf });
				AsyncStorage.setItem('BioAuth', JSON.stringify({ username, password }));
				FingerprintScanner.release();
			})
			.catch((error) => {
				console.log('Отмена активации', error);
				FingerprintScanner.release();
			});
	};

	const activityIndicator = () => {
		if (props.loading) {
			return <Indicator />;
		}
		return (
			<Button
				title="Зарегистрироваться"
				onPress={onButtonPress}
				disabled={activeButton.current}
				containerStyle={{ paddingHorizontal: 8 }}
				buttonStyle={{ backgroundColor: '#379683' }}
			/>
		);
	};

	if (
		username &&
		password &&
		password2 &&
		email &&
		!regexPassword.current &&
		!regexEmail &&
		!regexUsername.current &&
		!regexPassword2.current
	) {
		activeButton.current = false;
	} else {
		activeButton.current = true;
	}

	const error = () => {
		if (!props.error) {
			return null;
		}
		return <Text>{props.error}</Text>;
	};

	console.log('CSRF', props);

	navigation.addListener('focus', () => {
		props.clearErrorMessage();
	});

	const regex = {};
	const validateUsername = (username) => {
		regex.username = /^[a-zA-Z0-9]+$/;
		return regex.username.test(username);
	};
	const validateEmail = (email) => {
		regex.email = /^([\w!.%+\-])+@([\w\-])+(?:\.[\w\-]+)+$/;
		return regex.email.test(email);
	};
	const validatePassword = (password) => {
		regex.password = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/;
		return regex.password.test(password);
	};

	return (
		<View style={Platform.OS === 'ios' ? { paddingTop: 50 } : null}>
			<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : null}>
				<ScrollView keyboardShouldPersistTaps="always">
					<Image
						source={require('../../../assets/firstLaunchScreenImages/bitmap.png')}
						style={{ width: 350, height: 60, marginTop: 15, alignSelf: 'center' }}
						resizeMode="contain"
					/>
					<Text
						h3
						style={{
							alignSelf: 'center',
							textAlign: 'center',
							color: '#EB9156',
						}}
					>
						Регистрация
					</Text>

					<View style={styles.inputsContainer}>
						<Input
							inputStyle={{ height: 50 }}
							labelStyle={{ color: '#379683' }}
							accessibilityLabel="Name for registration"
							accessibilityHint="Registration Name"
							label="Имя пользователя"
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
							inputStyle={{ height: 50 }}
							labelStyle={{ color: '#379683' }}
							accessibilityLabel="E-mail for registration"
							accessibilityHint="Registration E-mail"
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

						<Input
							inputStyle={{ height: 50 }}
							labelStyle={{ color: '#379683' }}
							accessibilityLabel="Password for registration"
							accessibilityHint="Registration Password"
							secureTextEntry
							label="Пароль"
							autoCapitalize="none"
							autoCorrect={false}
							value={password}
							onChangeText={(text) => {
								props.inputChange({
									prop: 'password',
									value: text,
								});
								console.log(password);
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
						<Input
							inputStyle={{ height: 50 }}
							labelStyle={{ color: '#379683' }}
							accessibilityLabel="Password for registration"
							accessibilityHint="Repeate registration password"
							secureTextEntry
							label="Повторите пароль"
							autoCapitalize="none"
							autoCorrect={false}
							value={password2}
							onChangeText={(text) => {
								props.inputChange({
									prop: 'password2',
									value: text,
								});
								console.log(password2);
								if (
									validatePassword(text) &&
									props.password.toString === props.password2.toString
								) {
									regexPassword2.current = '';
								} else {
									regexPassword2.current = 'Пароли не совпадают';
								}
							}}
							errorStyle={{ color: 'red' }}
							errorMessage={regexPassword2.current}
						/>

						{activityIndicator()}
						{error()}
					</View>

					<TouchableOpacity
						style={{
							alignSelf: 'center',
							marginTop: 20,
							borderBottomWidth: 2,
							borderBottomColor: '#379683',
						}}
						onPress={() => {
							navigation.navigate('Signin');
						}}
					>
						<Text style={{ fontSize: 15, color: '#379683' }}>
							Перейти на экран входа
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
			</KeyboardAvoidingView>
			<Modal visible={isModalVisible} animationType="slide" transparent>
				<View style={styles.modalContainer}>
					<TouchableOpacity
						onPress={() => setModalVisible(false)}
						style={{ alignSelf: 'flex-end', marginBottom: 10 }}
					>
						<MaterialCommunityIcons name="close" size={35} />
					</TouchableOpacity>
					<Text style={{ textAlign: 'center', fontSize: 20 }}>
						Активировать биометрическую аутентификацию для другого пользователя?
					</Text>
					<View style={{ flexDirection: 'row', paddingTop: 15, flex: 1 }}>
						<Button
							title="Нет"
							onPress={() => props.signup({ username, email, password, _csrf })}
							containerStyle={{ paddingHorizontal: 8, flex: 1 }}
							buttonStyle={{ backgroundColor: '#379683' }}
						/>
						<Button
							title="Да"
							onPress={() => changeBioAuthUser()}
							containerStyle={{ paddingHorizontal: 8, flex: 1 }}
							buttonStyle={{ backgroundColor: '#379683' }}
						/>
					</View>
				</View>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
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

SignupScreen.navigationOptions = () => ({
	headerShown: false,
});

const mapStateToProps = ({ auth }) => {
	const { username, email, password, password2, loading, error, _csrf } = auth;

	return { username, email, password, password2, loading, error, _csrf };
};

export default connect(mapStateToProps, {
	inputChange,
	signup,
	clearErrorMessage,
	getCsrf,
	activateBioAuth,
	checkBioScanner,
	resolveAuth,
})(SignupScreen);
