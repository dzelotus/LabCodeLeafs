/* eslint-disable prettier/prettier */
/* eslint-disable operator-linebreak */
import {
	PermissionsAndroid,
	StatusBar,
	Text,
	TouchableOpacity,
	View,
	Platform,
	StyleSheet,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { PERMISSIONS, requestMultiple } from 'react-native-permissions';
import { Camera } from 'expo-camera';
import CameraRoll from '@react-native-community/cameraroll';
import { withNavigationFocus } from '@react-navigation/compat';
import CameraButtons from '../components/CameraButtons';
import PhotoCameraScroll from '../components/PhotoCameraScroll';
import imagePicker from '../hooks/imagePicker';
import makePhoto from '../hooks/makePhoto';
import GoBackButton from '../components/GoBackButton';
import HowMakePhotoButton from '../components/HowMakePhotoButton'

/* import makePhoto from '../hooks/makePhoto'; */

const ScanLeafScreen = (route) => {
	const [type, setType] = useState(Camera.Constants.Type.back);
	const [flashType, setFlashType] = useState(Camera.Constants.FlashMode.off);
	const [data, setData] = useState([]);
	const [nextPage, setNextPage] = useState();

	let camera;

	const getImages = async () => {
		console.log('CAMERA ROLL');
		await CameraRoll.getPhotos({
			first: 20,
			assetType: 'Photos',
			include: ['imageSize', 'filename', 'fileSize', 'location', 'playableDuration'],
			groupTypes: 'All',
		}).then((img) => {
			console.log('IMG', img);
			setData(img.edges);
			setNextPage(img.page_info);
		});
	};

	const dataMoreLoading = async () => {
		console.log('ML START');
		if (nextPage.has_next_page) {
			await CameraRoll.getPhotos({
				first: 20,
				after: nextPage.end_cursor,
				assetType: 'Photos',
				include: ['imageSize', 'filename', 'fileSize', 'location', 'playableDuration'],
				groupTypes: 'All',
			}).then((response) => {
				console.log('MR');
				setData([...data, ...response.edges]);
				setNextPage(response.page_info);
			});
		}
	};

	const askPerms = async () => {
		await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
		await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
		await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);

		/* checkCameraPermissions(); */
	};

	useEffect(() => {
		getImages();
		route.navigation.addListener('focus', () => {
			Platform.OS === 'android'
				? askPerms()
				: requestMultiple([
					PERMISSIONS.IOS.PHOTO_LIBRARY,
					PERMISSIONS.IOS.CAMERA,					
				  ]).then((statuses) => {
					console.log('Camera', statuses[PERMISSIONS.IOS.CAMERA]);
					console.log('PL', statuses[PERMISSIONS.IOS.PHOTO_LIBRARY]);					
				  });
		});
	}, []);


	return (
		<View style={{ flex: 1, justifyContent: 'flex-end' }}>
			{route.isFocused && (
				<>
					<StatusBar hidden />
					
					<View style={styles.backButtonContainer}>
						<GoBackButton nav="Main" />
					</View>
					<View style={styles.howMakePhotoButtonContainer}>
						<HowMakePhotoButton nav="Main" />
					</View>		
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
						<View
							style={{
								height: '100%',
								width: '100%',
								position: 'absolute',

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

const padding = Platform.OS === 'ios' ? 50 : 0;

const styles = StyleSheet.create({
	backButtonContainer: {
		position: 'absolute',
		top: 0,
		left: 15,
		paddingTop: padding,
		zIndex: 100,
	},
	howMakePhotoButtonContainer: {
		position: 'absolute',
		top: 0,
		right: 15,
		paddingTop: padding,
		zIndex: 100,
	},
});

export default withNavigationFocus(ScanLeafScreen);
