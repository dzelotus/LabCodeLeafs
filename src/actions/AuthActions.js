import AsyncStorage from '@react-native-community/async-storage';
import FingerprintScanner from 'react-native-fingerprint-scanner';
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
} from './types';

import nodeApi from '../api/nodeApi';

export const inputChange = ({ prop, value }) => ({
	type: INPUT_CHANGE,
	payload: { prop, value },
});

export const getCsrf = () => (dispatch) => {
	dispatch({ type: GET_CSRF, loading: true });
	nodeApi
		.get('/login')
		.then((response) => {
			dispatch({ type: GET_CSRF, payload: response.data.csrfToken, loading: false });
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
			if (response) {
				AsyncStorage.getItem('BioAuth').then((result) => {
					console.log('RES', result);
					if (result === null) {
						activateBioAuth({ dispatch, response, username, password });
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

const activateBioAuth = ({ dispatch, response, username, password }) => {
	FingerprintScanner.authenticate({
		title: 'Вход по отпечатку пальца',
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
			const { success } = response.data;
			console.log('SUCCESS', success);
			if (success) {
				signinSuccess(dispatch, response.data);
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
		payload: { prop: 'loadStart', value: true },
	});
	dispatch({
		type: RESOLVE_AUTH,
		payload: { prop: 'isSigned', value: true },
	});
	dispatch({
		type: RESOLVE_AUTH,
		payload: { prop: 'fistLaunchToken', value: true },
	});
};

export const clearErrorMessage = () => ({
	type: CLEAR_ERROR_MESSAGE,
});

export const resolveAuth = ({ prop, value }) => ({
	type: RESOLVE_AUTH,
	payload: { prop, value },
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
				.catch((error) => console.log('ERROR', error));
		})
		.catch((error) => console.log('ERROR', error));
};
