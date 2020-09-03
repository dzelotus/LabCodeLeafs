import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, TouchableOpacity, PermissionsAndroid } from 'react-native';
import CameraButtons from '../components/CameraButtons';
import PhotoCameraScroll from '../components/PhotoCameraScroll';
import { Camera } from 'expo-camera';
import { withNavigationFocus } from '@react-navigation/compat';
import CameraRoll from '@react-native-community/cameraroll';
import imagePicker from '../hooks/imagePicker';
import makePhoto from '../hooks/makePhoto';

/*import makePhoto from '../hooks/makePhoto';*/

const ScanLeafScreen = (route) => {
	const [type, setType] = useState(Camera.Constants.Type.back);
	const [flashType, setFlashType] = useState(Camera.Constants.FlashMode.off);
	const [data, setData] = useState([]);
	const [nextPage, setNextPage] = useState();

	let camera;

	const getImages = async () => {
		await CameraRoll.getPhotos({
			first: 20,
			assetType: 'Photos',
			include: ['imageSize', 'filename', 'fileSize', 'location', 'playableDuration'],
			groupTypes: 'All',
		}).then((img) => {
			console.log(img);
			setData(img.edges);
			setNextPage(img.page_info);
		});
	};

	const dataMoreLoading = async () => {
		if (nextPage.has_next_page) {
			let moreData = await CameraRoll.getPhotos({
				first: 20,
				after: nextPage.end_cursor,
				assetType: 'Photos',
				include: ['imageSize', 'filename', 'fileSize', 'location', 'playableDuration'],
				groupTypes: 'All',
			}).then(
				(response) => (
					setData([...data, ...response.edges]), setNextPage(response.page_info)
				),
			);
		}
	};

	useEffect(() => {
		const focus = route.navigation.addListener('focus', () => {
			console.log('ASK');
			askPerms();
		});
	}, []);

	const askPerms = async () => {
		await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
		await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
		await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
		getImages();
		/*checkCameraPermissions();*/
	};

	/*const checkCameraPermissions = async () => {
    const { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);

    if (status != 'granted') {
      Alert.alert('Внимание!', 'Для сканирования требуется доступ к камере и галерее');
    }
  };*/

	/*const checkLocationPermissions = async () => {
    const { status } = await Permissions.getAsync(Permissions.LOCATION);

    if (status != 'granted') {
      Alert.alert('Внимание!', 'Для правильной работы приложения требуется доступ к геолокации');
    }
  };*/

	return (
		<View style={{ flex: 1, justifyContent: 'flex-end' }}>
			{route.isFocused && (
				<>
					<StatusBar hidden={true} />
					<Camera
						style={{
							flex: 1,
							justifyContent: 'flex-end',
							borderWidth: 5,
							borderColor: 'green',
						}}
						type={type}
						flashMode={flashType}
						ratio="16:9"
						ref={(ref) => (camera = ref)}>
						<TouchableOpacity
							style={{
								alignItems: 'center',
							}}
							onPress={() =>
								imagePicker({
									nav: route.navigation.navigate,
								})
							}>
							<Text style={{ fontSize: 20, color: 'white' }}>Выбрать из галереи</Text>
						</TouchableOpacity>

						<PhotoCameraScroll data={data} moreLoading={dataMoreLoading} />

						<CameraButtons
							camera={() => {
								setType(
									type === Camera.Constants.Type.back
										? Camera.Constants.Type.front
										: Camera.Constants.Type.back,
								);
							}}
							photo={() =>
								makePhoto({
									camera: camera,
									nav: route.navigation.navigate,
								})
							}
							flash={() => {
								setFlashType(
									flashType === Camera.Constants.FlashMode.off
										? Camera.Constants.FlashMode.on
										: Camera.Constants.FlashMode.off,
								);
							}}
							flashType={flashType}
						/>
					</Camera>
				</>
			)}
		</View>
	);
};

export default withNavigationFocus(ScanLeafScreen);
