import * as ImagePicker from 'expo-image-picker';
/* import { launchImageLibrary } from 'react-native-image-picker'; */

const imagePicker = ({ nav }) => {
	ImagePicker.launchImageLibraryAsync({
		mediaTypes: ImagePicker.MediaTypeOptions.All,
		aspect: [4, 3],
		allowsEditing: true,
	})
		.then((result) => {
			if (!result.cancelled) {
				nav('ScanPhoto', { img: result });
				console.log('SCANPH', result);
			}
		})
		.catch((error) => console.log(error));
};

/* const imagePicker = ({ nav }) => {
	const options = {
		mediaType: 'photo',
	};
	launchImageLibrary(options, (res) => {
		console.log('RES', res);
		nav('ScanPhoto', { img: res });
	});
}; */

export default imagePicker;
