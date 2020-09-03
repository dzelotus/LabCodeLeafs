import { Alert } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import nodeApi from '../api/nodeApi';

/*const getCsrf = ({ uri }) => {
		nodeApi
				.get("/profile/edit", {})
				.then((response) => {
						console.log("URI", response);
						postPhoto({ _csrf: response.data.csrfToken, fileURL: uri });
				})
				.catch((error) => {
						console.log("ERRR", error),
								Alert.alert(error.response.data.message);
				});
};*/

const postPhoto = ({ _csrf, fileURL }) => {
	let image = new FormData();
	image.append('image', {
		uri: fileURL,
		name: 'image.jpg',
		type: 'image/jpg',
	});
	image.append('_csrf', _csrf);

	nodeApi
		.put('/profile', image, {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'multipart/form-data',
			},
		})
		.then((response) => {
			console.log('RESPPHOTO', response);
		})
		.catch((error) => {
			console.log('ERROR PHOTO', error.response),
				Alert.alert('Ошибка', 'Что-то пошло не так, попробуйте еще раз');
		});
};

const avatarPicker = async ({ _csrf }) => {
	console.log('!!!', _csrf);
	await ImagePicker.launchImageLibraryAsync({
		mediaTypes: ImagePicker.MediaTypeOptions.All,
		allowsEditing: true,
		aspect: [4, 3],
		quality: 1,
	})
		.then((result) => {
			console.log('URI1', result.uri);
			if (result.uri) {
				postPhoto({ fileURL: result.uri, _csrf: _csrf });
			}
		})
		.catch((error) => console.log(error));
};

export default avatarPicker;
