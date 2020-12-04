import CameraRoll from '@react-native-community/cameraroll';
import Geolocation from '@react-native-community/geolocation';

const getCoords = () =>
	Geolocation.getCurrentPosition(
		(info) => {
			console.log('LOC', info);
			return info.coords;
		},
		(e) => {
			console.log(e);
		},
		{ timeout: 20000 },
	);

const makePhoto = async ({ camera, nav }) => {
	console.log(getCoords());

	let photoUri;
	const options = {
		quality: 0.5,
		exif: true,
		skipProcessing: true,
		writeExif: { GPSLatitude: 59, GPSLongitude: 59, GPSAltitude: 0 },
	};
	await camera.takePictureAsync(options).then((resp) => {
		console.log('SHOT', resp);
		photoUri = resp;
	});

	console.log(photoUri);

	await CameraRoll.save(photoUri.uri, { type: 'photo', album: 'Leafs' })
		.then(() => {
			nav('ScanPhoto', {
				img: photoUri,
			});
		})
		.catch((error) => console.log(error));
};

export default makePhoto;
