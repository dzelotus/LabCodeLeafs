import { FETCH_CATALOG, FETCH_SUCCESS, FETCH_FAIL } from '../actions/types';

const INITIAL_STATE = {
	data: [],
	loading: false,
	error: false,
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case FETCH_CATALOG:
			return { ...state, loading: true };
		case FETCH_SUCCESS:
			return { ...state, loading: false, data: action.payload };
		case FETCH_FAIL:
			return { ...state, loading: false, error: true };
		default:
			return state;
	}
};
