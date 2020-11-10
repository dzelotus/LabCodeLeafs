import { GARDEN_INPUT_CHANGE, GET_CSRF, GET_GARDENS } from '../actions/types';

const INITIAL_STATE = {
	gardenName: '',
	gardenDescription: '',
	csrf: '',
	loading: false,
	gardenData: [],
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case GARDEN_INPUT_CHANGE:
			return { ...state, [action.payload.prop]: action.payload.value };
		case GET_CSRF:
			return { ...state, csrf: action.payload, loading: action.loading };
		case GET_GARDENS:
			return {
				...state,
				gardenData: action.data,
				loading: action.loading,
			};
		default:
			return state;
	}
};
