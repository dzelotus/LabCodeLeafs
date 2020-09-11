import {
	CHANGE_SCREEN,
	CLEAR_ERROR_MESSAGE,
	GET_CSRF,
	INPUT_CHANGE,
	RESOLVE_AUTH,
	SIGNIN,
	SIGNIN_FAIL,
	SIGNIN_SUCCESS,
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
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case INPUT_CHANGE:
			return { ...state, [action.payload.prop]: action.payload.value };
		case GET_CSRF:
			return { ...state, [action.payload.prop]: action.payload.value };
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
			return { ...state, error: '' };
		case RESOLVE_AUTH:
			return { ...state, [action.payload.prop]: action.payload.value };
		case CHANGE_SCREEN:
			return {
				...state,
				screenName: action.name,
				screenComponent: action.component,
				screenOptions: action.options,
			};
		default:
			return state;
	}
};
