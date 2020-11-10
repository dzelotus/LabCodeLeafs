import { GARDEN_INPUT_CHANGE, GET_CSRF, GET_GARDENS } from './types';
import nodeApi from '../api/nodeApi';

export const inputChange = ({ prop, value }) => ({
	type: GARDEN_INPUT_CHANGE,
	payload: { prop, value },
});

export const getCsrf = () => (dispatch) => {
	dispatch({ type: GET_CSRF, loading: true });
	nodeApi
		.get('/garden/new')
		.then((response) => {
			dispatch({ type: GET_CSRF, payload: response.data.csrfToken, loading: false });
		})
		.catch((e) => console.log('ERR', e.response));
};

export const getGardens = () => (dispatch) => {
	dispatch({ type: GET_GARDENS, loading: true });
	nodeApi
		.get('/garden')
		.then((response) => {
			console.log(response.data.data);
			dispatch({ type: GET_GARDENS, data: response.data.data, loading: false });
		})
		.catch((error) => console.log(error));
};

export const openGarden = (index) => {
	console.log('INDEX', index);
};
