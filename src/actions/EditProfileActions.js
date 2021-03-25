import { GET_PROFILE_INFO, PROFILE_INPUT_CHANGE, EDIT, EDIT_PHOTO } from './types';
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
			console.log('ACTION', response.data.data.profile_image);
			dispatch({
				type: GET_PROFILE_INFO,
				name: response.data.data.name,
				surname: response.data.data.surname,
				avatar: response.data.data.profile_image,
				username: response.data.data.username,
				screenLoading: false,
			});
		})
		.catch((error) => console.log(error));
};

export const updateProfileInfo = ({ name, surname, newPhoto, photo }) => (dispatch) => {
	dispatch({ type: EDIT, loading: true });
	console.log('newPhoto', newPhoto);
	nodeApi
		.get('/profile/edit')
		.then((response) => {
			const _csrf = response.data.csrfToken;
			const image = new FormData();
			if (newPhoto) {
				image.append('profile_image', {
					uri: newPhoto,
					name: 'image.jpg',
					type: 'image/jpg',
				});
			} else {
				image.append('profile_image', photo);
			}
			image.append('_csrf', _csrf);
			image.append('name', name);
			image.append('surname', surname);

			nodeApi
				.put('/profile', image, {
					headers: {
						Accept: 'application/json',
						'Content-Type': 'multipart/form-data;',
					},
				})
				.then((response) => {
					console.log('EDIT', response);
					dispatch({ type: EDIT, loading: false });
					RootNavigation.navigate('Profile');
				})
				.catch((res) => {
					console.log(image);
					console.log('ER', res);
					dispatch({ type: EDIT, loading: false });
				});
		})
		.catch((error) => {
			console.log('RESP ERROR', error.response);
			dispatch({ type: EDIT, loading: false });
		});
};

export const setPhoto = (photoInput) => (dispatch) => {
	console.log('photoInput', photoInput);
	dispatch({ type: EDIT_PHOTO, avatar: photoInput });
};
