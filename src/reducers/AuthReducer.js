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
} from '../actions/types';

const INITIAL_STATE = {
	username: '',
	email: '',
	password: '',
	error: '',
	loading: false,
	firstLaunchToken: '',
	isSigned: false,
	loadStart: '',
	screenName: '',
	screenComponent: '',
	screenOptions: {},
	hasBioScanner: false,
	isBioAuthActive: false,
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case INPUT_CHANGE:
			return { ...state, [action.payload.prop]: action.payload.value };
		case GET_CSRF:
			return { ...state, _csrf: action.payload, loading: action.loading };
		case SIGNIN:
			return { ...state, loading: true };
		case SIGNIN_SUCCESS:
			return {
				...state,
				...INITIAL_STATE,
				loading: false,
			};
		case SIGNIN_FAIL:
			return { ...state, error: action.payload, loading: false };
		case CLEAR_ERROR_MESSAGE:
			return { ...state, error: '', username: '', password: '', email: '' };
		case RESOLVE_AUTH:
			return { ...state, [action.payload.prop]: action.payload.value };

		case HAS_BIO_SCANNER:
			return {
				...state,
				hasBioScanner: action.hasBioPayload,
			};
		case IS_BIO_AUTH_ACTIVE:
			return { ...state, isBioAuthActive: action.isBioAuthActive };
		default:
			return state;
	}
};
