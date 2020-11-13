import {
	GARDEN_INPUT_CHANGE,
	GET_CSRF,
	GET_GARDENS,
	ADD_BUTTON,
	CREATE_GARDEN,
	CLEAR_STATE,
	DELETE_GARDEN,
	OPEN_ITEM,
	BUTTON_ACTION,
	EDIT_GARDEN,
	UPDATE_GARDEN,
} from '../actions/types';

const INITIAL_STATE = {
	gardenId: '',
	gardenName: '',
	gardenDescription: '',
	csrf: '',
	screenLoading: false,
	gardenData: [],
	addBtnSwitch: false,
	buttonLoading: false,
	itemLoading: false,
	itemOpenIndex: [],
	editButton: false,
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case CLEAR_STATE: {
			return { ...state, gardenName: '', gardenDescription: '', addBtnSwitch: false };
		}
		case GARDEN_INPUT_CHANGE:
			return { ...state, [action.payload.prop]: action.payload.value };
		case GET_CSRF:
			return { ...state, csrf: action.payload, screenLoading: action.screenLoading };
		case GET_GARDENS:
			return {
				...state,
				gardenData: action.data,
				screenLoading: action.screenLoading,
				itemLoading: action.itemLoading,
			};
		case ADD_BUTTON:
			return {
				...state,
				addBtnSwitch: action.addBtnSwitch,
			};
		case CREATE_GARDEN:
			return {
				...state,
				buttonLoading: action.buttonLoading,
			};
		case DELETE_GARDEN:
			return {
				...state,
				itemLoading: action.itemLoading,
			};
		case OPEN_ITEM:
			return {
				...state,
				itemOpenIndex: action.payload,
			};
		case BUTTON_ACTION:
			return {
				...state,
				editButton: action.editButton,
			};
		case EDIT_GARDEN:
			return {
				...state,
				gardenId: action.id,
				gardenName: action.name,
				gardenDescription: action.description,
				csrf: action.csrf,
				buttonLoading: action.buttonLoading,
			};
		case UPDATE_GARDEN:
			return {
				...state,
			};
		default:
			return state;
	}
};
