import { FETCH_CATALOG, FETCH_SUCCESS, FETCH_FAIL } from './types';
import nodeApi from '../api/nodeApi';

export const fetchCatalog = () => {
	return (dispatch) => {
		nodeApi
			.get('/harmful-organisms/')
			.then(
				(response) => (
					console.log('RESP', response), fetchSuccess(dispatch, response.data.data)
				),
			)
			.catch((error) => console.log('ERROR', error.response));
		dispatch({ type: FETCH_CATALOG });
	};
};

const fetchSuccess = (dispatch, response) => {
	dispatch({
		type: FETCH_SUCCESS,
		payload: response,
	});
};
