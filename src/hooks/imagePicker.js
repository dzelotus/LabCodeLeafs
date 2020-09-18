import * as ImagePicker from 'expo-image-picker';

const imagePicker = async ({ nav }) => {
	await ImagePicker.launchImageLibraryAsync({
		mediaTypes: ImagePicker.MediaTypeOptions.All,
		allowsEditing: true,
		quality: 1,
	})
		.then((result) => {
			if (!result.cancelled) {
				nav('ScanPhoto', { img: result });
				console.log('SCANPH', result);
			}
		})
		.catch((error) => console.log(error));
};

export default imagePicker;
