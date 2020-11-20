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
	GET_PLANTS_DATA,
} from './types';
import nodeApi from '../api/nodeApi';

export const clearState = () => ({
	type: CLEAR_STATE,
});

export const inputChange = ({ prop, value }) => ({
	type: GARDEN_INPUT_CHANGE,
	payload: { prop, value },
});

export const getCsrf = () => (dispatch) => {
	nodeApi
		.get('/garden/new')
		.then((response) => {
			dispatch({ type: GET_CSRF, payload: response.data.csrfToken });
		})
		.catch((e) => console.log('ERR', e.response));
};

export const getGardens = (switcher) => (dispatch) => {
	console.log('FUCKER', switcher);
	if (switcher === 'screenLoading') {
		dispatch({ type: GET_GARDENS, screenLoading: true });
	} else {
		dispatch({ type: GET_GARDENS, itemLoading: true });
	}

	dispatch(getCsrf());
	nodeApi
		.get('/garden')
		.then((response) => {
			dispatch({
				type: GET_GARDENS,
				data: response.data.data,
				screenLoading: false,
				itemLoading: false,
			});
		})
		.catch((error) => {
			console.log(error);
			dispatch({
				type: GET_GARDENS,
				screenLoading: false,
				itemLoading: false,
			});
		});
};

export const openGarden = (index) => (dispatch) => {
	dispatch({ type: OPEN_ITEM, payload: index });
};

export const addButtonSwitch = (btnSwitch) => (dispatch) => {
	dispatch({ type: ADD_BUTTON, addBtnSwitch: btnSwitch });
};

export const createGarden = (gardenName, gardenDescription, csrf) => (dispatch) => {
	dispatch({ type: CREATE_GARDEN, buttonLoading: true });
	nodeApi
		.post('/garden', {
			name: gardenName,
			description: gardenDescription,
			_csrf: csrf,
		})
		.then(() => {
			dispatch({ type: CREATE_GARDEN, buttonLoading: false });

			dispatch(getGardens('itemLoading'));
			dispatch(clearState());
		})
		.catch(() => {
			dispatch({ type: CREATE_GARDEN, buttonLoading: false });
			dispatch(getGardens('itemLoading'));
		});
};

export const deleteGarden = (gardenId) => (dispatch) => {
	dispatch({ type: DELETE_GARDEN, itemLoading: true });
	nodeApi
		.delete(`garden/${gardenId}`)
		.then(() => {
			dispatch(getGardens('itemLoading'));
		})
		.catch((error) => {
			console.log(error);
			dispatch(getGardens('itemLoading'));
		});
};

export const changeButtonAction = (editButton) => (dispatch) => {
	dispatch({ type: BUTTON_ACTION, editButton });
};

export const editGarden = (gardenId) => (dispatch) => {
	dispatch({ type: EDIT_GARDEN, buttonLoading: true });
	nodeApi
		.get(`garden/${gardenId}/edit`)
		.then((response) => {
			dispatch({
				type: EDIT_GARDEN,
				name: response.data.data.name,
				description: response.data.data.description,
				id: response.data.data.id,
				buttonLoading: false,
				csrf: response.data.csrfToken,
			});
		})
		.catch((error) => console.log(error));
};

export const updateGarden = (gardenId, gardenName, gardenDescription, csrf) => (dispatch) => {
	nodeApi
		.put(`garden/${gardenId}`, {
			name: gardenName,
			description: gardenDescription,
			_csrf: csrf,
		})
		.then(() => {
			dispatch(getGardens());
			dispatch(clearState());
		})
		.catch((error) => {
			console.log(error.response);
		});
};

export const getPlantsData = (gardenId) => (dispatch) => {
	dispatch({ type: GET_PLANTS_DATA, index: gardenId.index, plantsLoading: true });

	nodeApi
		.get(`/garden-planting/${gardenId.index}`)
		.then((response) => {
			dispatch({
				type: GET_PLANTS_DATA,
				index: gardenId.index,
				plantsData: response.data.data,
				plantsLoading: false,
			});
		})
		.catch((error) => console.log(error.response));
};
