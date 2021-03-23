import { GET_PROFILE_INFO, PROFILE_INPUT_CHANGE, EDIT } from './types';
import nodeApi from '../api/nodeApi';
import * as RootNavigation from '../RootNavigation';

export const inputChange = ({ prop, value }) => ({
	type: PROFILE_INPUT_CHANGE,
	payload: { prop, value },
});

export const getProfileInfo = () => (dispatch) => {
	dispatch({ type: GET_PROFILE_INFO, screenLoading: true });
	nodeApi
		.get('/profile')
		.then((response) => {
			console.log('ACTION', response);
			dispatch({
				type: GET_PROFILE_INFO,
				name: response.data.data.name,
				surname: response.data.data.surname,
				photo: response.data.data.logo_url,
				username: response.data.data.username,
				screenLoading: false,
			});
		})
		.catch((error) => console.log(error));
};

export const updateProfileInfo = ({ name, surname }) => (dispatch) => {
	dispatch({ type: EDIT, loading: true });
	nodeApi
		.get('/profile/edit')
		.then((response) => {
			const _csrf = response.data.csrfToken;
			nodeApi
				.put('/profile', {
					name,
					surname,
					_csrf,
				})
				.then((response) => {
					console.log('EDIT', response);
					dispatch({ type: EDIT, loading: false });
					RootNavigation.navigate('Profile');
				})
				.catch((error) => console.log('EDIT FAIL', error.response.data.data));
		})
		.catch((error) => console.log('RESP ERROR', error));
};
