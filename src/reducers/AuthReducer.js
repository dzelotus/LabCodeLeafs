import {
	CLEAR_ERROR_MESSAGE,
	GET_CSRF,
	INPUT_CHANGE,
	RESOLVE_AUTH,
	SIGNIN,
	SIGNIN_FAIL,
	SIGNIN_SUCCESS,
	HAS_BIO_SCANNER,
	IS_BIO_AUTH_ACTIVE,
	HAS_INTERNET_CONNECTION,
	START_WITHOUT_INTERNET,
	RESOLVE_LOADING,
} from '../actions/types';

const INITIAL_STATE = {
	username: '',
	email: '',
	password: '',
	error: '',
	loading: true,
	firstLaunchToken: 'wait',
	isSigned: false,
	screenName: '',
	screenComponent: '',
	screenOptions: {},
	hasBioScanner: false,
	isBioAuthActive: false,
	toSignupScreen: false,
	toAuthFlow: false,
	hasInternetConnection: 'wait',
	startWithoutInternet: false,
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case INPUT_CHANGE:
			return { ...state, [action.payload.prop]: action.payload.value };
		case GET_CSRF:
			return { ...state, _csrf: action.payload, loading: action.loading };
		case SIGNIN:
			return { ...state };
		case SIGNIN_SUCCESS:
			return {
				...state,
			};
		case SIGNIN_FAIL:
			return { ...state, error: action.payload };
		case CLEAR_ERROR_MESSAGE:
			return { ...state, error: '', username: '', password: '', email: '' };
		case RESOLVE_AUTH:
			return { ...state, [action.payload.prop]: action.payload.value };
		case RESOLVE_LOADING:
			return { ...state, loading: action.payload };
		case HAS_BIO_SCANNER:
			return {
				...state,
				hasBioScanner: action.hasBioPayload,
			};
		case IS_BIO_AUTH_ACTIVE:
			return { ...state, isBioAuthActive: action.isBioAuthActive };
		case HAS_INTERNET_CONNECTION:
			return {
				...state,
				hasInternetConnection: action.hasInternetConnection,
			};
		case START_WITHOUT_INTERNET:
			return {
				...state,
				startWithoutInternet: action.startWithoutInternet,
			};
		default:
			return state;
	}
};
