/* eslint-disable operator-linebreak */
import { PermissionsAndroid, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';

import { Camera } from 'expo-camera';
import CameraRoll from '@react-native-community/cameraroll';
import { withNavigationFocus } from '@react-navigation/compat';
import CameraButtons from '../components/CameraButtons';
import PhotoCameraScroll from '../components/PhotoCameraScroll';
import imagePicker from '../hooks/imagePicker';
import makePhoto from '../hooks/makePhoto';

/* import makePhoto from '../hooks/makePhoto'; */

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
			await CameraRoll.getPhotos({
				first: 20,
				after: nextPage.end_cursor,
				assetType: 'Photos',
				include: ['imageSize', 'filename', 'fileSize', 'location', 'playableDuration'],
				groupTypes: 'All',
			}).then((response) => {
				setData([...data, ...response.edges]);
				setNextPage(response.page_info);
			});
		}
	};

	const askPerms = async () => {
		await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
		await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
		await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
		getImages();
		/* checkCameraPermissions(); */
	};

	useEffect(() => {
		route.navigation.addListener('focus', () => {
			console.log('ASK');
			askPerms();
		});
	}, []);

	/* const checkCameraPermissions = async () => {
    const { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);

    if (status != 'granted') {
      Alert.alert('Внимание!', 'Для сканирования требуется доступ к камере и галерее');
    }
  }; */

	/* const checkLocationPermissions = async () => {
    const { status } = await Permissions.getAsync(Permissions.LOCATION);

    if (status != 'granted') {
      Alert.alert('Внимание!', 'Для правильной работы приложения требуется доступ к геолокации');
    }
  }; */

	return (
		<View style={{ flex: 1, justifyContent: 'flex-end' }}>
			{route.isFocused && (
				<>
					<StatusBar hidden />
					<Camera
						style={{
							flex: 1,
							justifyContent: 'flex-end',
						}}
						type={type}
						flashMode={flashType}
						ratio="16:9"
						ref={(ref) => (camera = ref)}
					>
						<Text style={{}} />
						<View
							style={{
								height: '100%',
								width: '100%',
								position: 'absolute',
								zIndex: 1,
								justifyContent: 'space-between',
							}}
						>
							<View
								style={{
									height: '18%',
									backgroundColor: 'rgba(1,1,1,0.6)',
									justifyContent: 'flex-end',
								}}
							>
								<Text
									style={{
										color: 'white',
										fontSize: 20,
										textAlign: 'center',
										justifyContent: 'flex-end',
										marginBottom: '1%',
									}}
								>
									Поместите лист в данную область
								</Text>
							</View>
							<View
								style={{
									height: '50%',

									flexDirection: 'row',
								}}
							>
								<View
									style={{
										height: '100%',
										width: '3%',
										backgroundColor: 'rgba(1,1,1,0.6)',
									}}
								/>
								<View
									style={{
										borderColor: 'white',
										borderWidth: 2,
										height: '100%',
										width: '94%',
										borderStyle: 'dashed',
										borderRadius: 1,
									}}
								/>
								<View
									style={{
										height: '100%',
										width: '3%',
										backgroundColor: 'rgba(1,1,1,0.6)',
									}}
								/>
							</View>
							<View
								style={{
									height: '32%',
									backgroundColor: 'rgba(1,1,1,0.6)',
									justifyContent: 'flex-end',
								}}
							/>
						</View>

						<TouchableOpacity
							style={{
								alignItems: 'center',
							}}
							onPress={() =>
								imagePicker({
									nav: route.navigation.navigate,
								})
							}
						>
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
									camera,
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
