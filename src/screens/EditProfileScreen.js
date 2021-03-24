/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
	View,
	TouchableOpacity,
	Text,
	TextInput,
	Image,
	ActivityIndicator,
	ScrollView,
	StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import {
	inputChange,
	getProfileInfo,
	updateProfileInfo,
	setPhoto,
} from '../actions/EditProfileActions';

const EditProfileScreen = (props) => {
	console.log('THIS IS PROPS', props);

	const onButtonPress = () => {
		const { name, surname, photo } = props;

		props.updateProfileInfo({ name, surname, photo });
	};

	const { screenLoading, photo, name, surname } = props;

	useEffect(() => {
		props.getProfileInfo();
		props.navigation.setOptions({
			headerTruncatedBackTitle: 'Назад',
		});
	}, []);

	const activeButton = () => {
		if (props.loading === true) {
			return (
				<View style={styles.buttonStyle}>
					<ActivityIndicator size="large" color="#379683" />
				</View>
			);
		}
		return (
			<TouchableOpacity style={styles.buttonStyle} onPress={() => onButtonPress()}>
				<Text style={styles.buttonText}>Сохранить</Text>
			</TouchableOpacity>
		);
	};
	console.log('PHOTO SCREEN', photo);

	const openCamera = () => {
		ImagePicker.launchCameraAsync()
			.then((res) => {
				console.log('RES', res);
				if (!res.cancelled) {
					props.setPhoto(res.uri);
				}
			})
			.catch((err) => console.log(err));
	};

	const openLibrary = () => {
		ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			aspect: [4, 3],
			allowsEditing: true,
		})
			.then((res) => {
				console.log('RES', res);
				if (!res.cancelled) {
					props.setPhoto(res.uri);
				}
			})
			.catch((error) => console.log(error));
	};

	const Avatar = () => {
		if(photo) {
			const photoUri = photo
				.replace('/var/leafs_files/upload/', 'https://api.leafs.pro/upload/')
				.replace('/usr/src/leafs_files/upload/', 'https://api.leafs.pro/upload/')
			return (
				<Image
					style={{
						flex: 1,
						height: 300,
						marginTop: 10,
					}}
					source={{
						uri: photoUri,
					}}
					resizeMode="contain"
				/>
			)
		} 
		return (
			<View style={{ alignSelf: 'center', marginTop: 10, height: 300, justifyContent: 'center'}}>
				<FontistoIcon name="user-secret" size={150}  />
			</View>
		)
		
	}



	if (screenLoading) {
		return (
			<View style={{ flex: 1, backgroundColor: 'white' }}>
				<ActivityIndicator size="large" color="#379683" style={{ flex: 1 }} />
			</View>
		);
	}
	return (
		<View style={{ backgroundColor: 'white', flex: 1 }}>
			<ScrollView keyboardShouldPersistTaps="always">
				<Avatar />
				<View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}>
					<TouchableOpacity style={styles.iconStyle} onPress={() => openCamera()}>
						<Icon name="camera" size={50} color="#379683" />
					</TouchableOpacity>
					<TouchableOpacity style={styles.iconStyle} onPress={() => openLibrary()}>
						<Icon name="image-area" size={50} color="#379683" />
					</TouchableOpacity>
				</View>
				<View style={styles.container}>
					<View style={styles.containerHeader}>
						<Text>Имя</Text>
					</View>
					<View
						style={{
							flex: 1,
							paddingHorizontal: 10,
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<TextInput
							style={{ flex: 1 }}
							value={name}
							onChangeText={(text) => {
								props.inputChange({
									prop: 'name',
									value: text,
								});
							}}
						/>
					</View>
				</View>

				<View style={styles.container}>
					<View style={styles.containerHeader}>
						<Text>Фамилия</Text>
					</View>
					<View
						style={{
							flex: 1,
							paddingHorizontal: 10,
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<TextInput
							style={{ flex: 1 }}
							value={surname}
							onChangeText={(text) => {
								props.inputChange({
									prop: 'surname',
									value: text,
								});
							}}
						/>
					</View>
				</View>
				<View style={{ marginTop: 20, justifyContent: 'flex-end' }}>{activeButton()}</View>
			</ScrollView>
		</View>
	);
};

const mapStateToProps = ({ profile }) => {
	const { name, surname, location, photo, data, _csrf, loading } = profile;

	return { name, surname, location, photo, data, _csrf, loading };
};

const styles = StyleSheet.create({
	inputLabel: {
		fontSize: 15,
		color: '#116B58',
	},
	inputContainer: {
		marginHorizontal: 40,
		marginTop: 20,
		borderBottomColor: '#379683',
		borderBottomWidth: 1,
	},
	focusedInput: {
		backgroundColor: '#D3D3D3',
	},
	inputInput: {
		paddingRight: 'auto',
	},
	iconStyle: {
		marginHorizontal: 10,
	},
	buttonStyle: {
		marginHorizontal: 15,
		marginVertical: 10,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		borderRadius: 10,
		borderColor: '#379683',
		borderWidth: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		height: 40,
		justifyContent: 'center',
	},
	buttonText: {
		fontSize: 18,
		textAlignVertical: 'center',
		textAlign: 'center',
		color: '#EB9156',
	},
	container: {
		marginHorizontal: 15,
		marginVertical: 10,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		borderRadius: 10,
		borderColor: '#379683',
		borderWidth: 1,
		backgroundColor: '#fff',
		height: 50,
	},
	containerHeader: {
		marginTop: -12,
		marginHorizontal: 10,
		paddingHorizontal: 10,
		backgroundColor: 'white',
		position: 'absolute',
	},
});

export default connect(mapStateToProps, {
	inputChange,
	getProfileInfo,
	updateProfileInfo,
	setPhoto,
})(EditProfileScreen);
