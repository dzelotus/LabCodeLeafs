import AsyncStorage from '@react-native-community/async-storage';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import NetInfo from '@react-native-community/netinfo';
import {
	CLEAR_ERROR_MESSAGE,
	GET_CSRF,
	HAS_BIO_SCANNER,
	INPUT_CHANGE,
	RESOLVE_AUTH,
	SIGNIN,
	SIGNIN_FAIL,
	SIGNIN_SUCCESS,
	IS_BIO_AUTH_ACTIVE,
	HAS_INTERNET_CONNECTION,
	START_WITHOUT_INTERNET,
	RESOLVE_LOADING,
	CHECK_INTERNET_CONNECTION,
} from './types';
import nodeApi from '../api/nodeApi';

export const inputChange = ({ prop, value }) => ({
	type: INPUT_CHANGE,
	payload: { prop, value },
});

export const getCsrf = () => (dispatch) => {
	nodeApi
		.get('/login')
		.then((response) => {
			dispatch({ type: GET_CSRF, payload: response.data.csrfToken });
		})
		.catch((e) => console.log('ERR', e.response));
};

export const signin = ({ username, password, _csrf }) => (dispatch) => {
	nodeApi
		.post('/login', {
			username,
			password,
			_csrf,
		})
		.then((response) => {
			if (response.data) {
				AsyncStorage.getItem('BioAuth')
					.then((result) => {
						const loginData = JSON.parse(result);
						if (result === null) {
							activateBioAuth({
								dispatch,
								response,
								username,
								password,
								title: 'Активировать биометрическую систему аутентификации?',
							});
						} else if (loginData.username === username) {
							signinSuccess(dispatch, response.data);
						} else {
							AsyncStorage.removeItem('BioAuth');
							activateBioAuth({
								dispatch,
								response,
								username,
								password,
								title: 'Сменить пользователя для биометрической аутентификации?',
							});
						}
					})
					.catch((error) => {
						console.log(error);
					});
			} else {
				signinFail(dispatch, response.data.message);
			}
		})
		.catch((error) => {
			signinFail(dispatch, error.response.data.message);
			console.log('REG ERROR', error.response.data.message);
		});

	dispatch({ type: SIGNIN });
};

export const activateBioAuth = ({ dispatch, response, username, password, title }) => {
	FingerprintScanner.authenticate({
		title,
		cancelButton: 'Отмена',
	})
		.then(() => {
			console.log('Активация', response);
			signinSuccess(dispatch, response.data);
			AsyncStorage.setItem('BioAuth', JSON.stringify({ username, password }));
			FingerprintScanner.release();
		})
		.catch((error) => {
			console.log('Отмена активации', error);
			signinSuccess(dispatch, response.data);
			FingerprintScanner.release();
		});
};

export const signup = ({ username, email, password, _csrf }) => (dispatch) => {
	nodeApi
		.post('/register', {
			username,
			email,
			password,
			_csrf,
		})
		.then((response) => {
			if (response.data) {
				AsyncStorage.getItem('BioAuth').then((result) => {
					console.log('RES', result);
					if (result === null) {
						activateBioAuth({
							dispatch,
							response,
							username,
							password,
							title: 'Активировать биометрическую систему аутентификации?',
						});
					} else {
						signinSuccess(dispatch, response.data);
					}
				});
			} else {
				console.log('FAIL');
				signinFail(dispatch, response.data.message);
			}
		})
		.catch((error) => {
			signinFail(dispatch, error.response.data.message);
			console.log('REG ERROR', error.response.data.message);
		});

	dispatch({ type: SIGNIN });
};

const signinFail = (dispatch, response) => {
	dispatch({
		type: SIGNIN_FAIL,
		payload: response,
	});
};

const signinSuccess = (dispatch, response) => {
	dispatch({
		type: SIGNIN_SUCCESS,
		payload: response,
	});
	dispatch({
		type: RESOLVE_AUTH,
		payload: { prop: 'toAuthFlow', value: false },
	});
	dispatch({
		type: RESOLVE_AUTH,
		payload: { prop: 'fistLaunchToken', value: true },
	});
	dispatch({
		type: RESOLVE_AUTH,
		payload: { prop: 'isSigned', value: true },
	});
};

export const checkAuth = () => (dispatch) => {
	nodeApi
		.get('user_authentication')
		.then((response) => {
			if (response.data.data) {
				console.log('SIGNED');
				dispatch({ type: RESOLVE_AUTH, payload: { prop: 'isSigned', value: true } });
			} else {
				console.log('NOT SIGNED');
				dispatch({ type: RESOLVE_AUTH, payload: { prop: 'isSigned', value: false } });
				dispatch({ type: RESOLVE_AUTH, payload: { prop: 'toAuthFlow', value: true } });
				dispatch({ type: RESOLVE_AUTH, payload: { prop: 'toSignUpScreen', value: false } });
			}
		})
		.catch((error) => {
			console.log(error.response);
			console.log('NOT SIGNED');
			dispatch({ type: RESOLVE_AUTH, payload: { prop: 'isSigned', value: false } });
		});
};

export const clearErrorMessage = () => ({
	type: CLEAR_ERROR_MESSAGE,
});

export const resolveAuth = ({ prop, value }) => ({
	type: RESOLVE_AUTH,
	payload: { prop, value },
});

export const resolveLoading = (value) => ({
	type: RESOLVE_LOADING,
	payload: value,
});

// логика для входа по отпечатку пальца

export const checkBioScanner = () => (dispatch) => {
	FingerprintScanner.isSensorAvailable()
		.then(() => {
			dispatch({
				type: HAS_BIO_SCANNER,
				hasBioPayload: true,
			});
			AsyncStorage.getItem('BioAuth')
				.then((result) => {
					console.log('BIO AUTH?', result);
					if (!result) {
						dispatch({ type: IS_BIO_AUTH_ACTIVE, isBioAuthActive: false });
					} else {
						dispatch({ type: IS_BIO_AUTH_ACTIVE, isBioAuthActive: true });
					}
				})
				.catch((error) => {
					console.log('ERROR', error);

					dispatch({ type: IS_BIO_AUTH_ACTIVE, isBioAuthActive: false });
				});
		})
		.catch((error) => {
			dispatch({
				type: HAS_BIO_SCANNER,
				hasBioPayload: false,
			});
			dispatch({ type: IS_BIO_AUTH_ACTIVE, isBioAuthActive: false });
			console.log('ERROR HERE', error);
		});
};

export const checkInternetConnection = () => (dispatch) => {
	console.log('START INTERNET CHECKING');
	NetInfo.fetch()
		.then((state) => {
			console.log('INTERNET STATE', state);
			dispatch({
				type: START_WITHOUT_INTERNET,
				startWithoutInternet: state.isConnected,
			});
			dispatch({
				type: HAS_INTERNET_CONNECTION,
				hasInternetConnection: state.isConnected,
			});
		})
		.catch(() => {
			dispatch({
				type: HAS_INTERNET_CONNECTION,
				hasInternetConnection: false,
			});
		});
};

export const resolveInternet = (payload) => (dispatch) => {
	dispatch({
		type: START_WITHOUT_INTERNET,
		startWithoutInternet: payload,
	});
};

export const refreshConnection = () => (dispatch) => {
	console.log('REFRESH');
	NetInfo.fetch()
		.then((state) => {
			console.log('STATE', state);
			dispatch({ type: CHECK_INTERNET_CONNECTION, checkInternet: state.isConnected });
		})
		.catch(() => console.log('HIC ERROR'));
};
