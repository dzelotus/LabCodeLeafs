import * as ImagePicker from 'expo-image-picker';

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

export default imagePicker;
