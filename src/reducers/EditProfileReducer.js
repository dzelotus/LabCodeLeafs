import {
	GET_PROFILE_INFO,
	PROFILE_INPUT_CHANGE,
	EDIT,
	GET_PROFILE_CSRF,
	GET_CSRF_SUCCESS,
} from '../actions/types';

const INITIAL_STATE = {
	name: '',
	surname: '',
	location: '',
	photo: '',
	screenLoading: true,
	loading: false,
	data: [],
	_csrf: '',
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case GET_PROFILE_INFO:
			return {
				...state,
				name: action.name,
				surname: action.surname,
				photo: action.avatar,
				screenLoading: true,
			};
		case GET_PROFILE_CSRF:
			return { ...state };
		case GET_CSRF_SUCCESS:
			return { ...state, _csrf: action.payload };
		case PROFILE_INPUT_CHANGE:
			return { ...state, [action.payload.prop]: action.payload.value };
		case EDIT:
			return { ...state, loading: false };
		default:
			return state;
	}
};
