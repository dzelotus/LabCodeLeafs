import {
	INPUT_CHANGE,
	SIGNIN,
	SIGNIN_FAIL,
	SIGNIN_SUCCESS,
	CLEAR_ERROR_MESSAGE,
	GET_CSRF,
	RESOLVE_AUTH,
	CHANGE_SCREEN,
} from './types';
import nodeApi from '../api/nodeApi';

export const inputChange = ({ prop, value }) => {
	return {
		type: INPUT_CHANGE,
		payload: { prop, value },
	};
};

export const getCsrf = ({ prop, value }) => {
	return {
		type: GET_CSRF,
		payload: { prop, value },
	};
};

export const signin = ({ username, password, _csrf }) => {
	return (dispatch) => {
		nodeApi
			.post('/login', {
				username,
				password,
				_csrf,
			})
			.then((response) => {
				const success = response.data.success;
				console.log('SUCCESS', success);
				if (success) {
					signinSuccess(dispatch, response.data);
				} else {
					console.log('FAIL');
					signinFail(dispatch, response.data.message);
				}
			})
			.catch(
				(error) => (
					signinFail(dispatch, error.response.data.message),
					console.log('REG ERROR', error.response.data.message)
				),
			);

		dispatch({ type: SIGNIN });
	};
};

export const signup = ({ username, email, password, _csrf }) => {
	return (dispatch) => {
		const response = nodeApi
			.post('/register', {
				username,
				email,
				password,
				_csrf,
			})
			.then((response) => {
				const success = response.data.success;
				console.log('SUCCESS', success);
				if (success) {
					signinSuccess(dispatch, response.data);
				} else {
					console.log('FAIL');
					signinFail(dispatch, response.data.message);
				}
			})
			.catch(
				(error) => (
					signinFail(dispatch, error.response.data.message),
					console.log('REG ERROR', error.response.data.message)
				),
			);

		dispatch({ type: SIGNIN });
	};
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
		payload: { prop: 'signToken', value: true },
	});
};

export const clearErrorMessage = () => {
	return {
		type: CLEAR_ERROR_MESSAGE,
	};
};

export const resolveAuth = ({ prop, value }) => {
	return {
		type: RESOLVE_AUTH,
		payload: { prop, value },
	};
};

export const changeScreen = ({ screenName, screenComponent, screenOptions }) => {
	return {
		type: CHANGE_SCREEN,
		name: screenName,
		component: screenComponent,
		options: screenOptions,
	};
};
