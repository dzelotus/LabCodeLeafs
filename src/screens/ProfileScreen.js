/* eslint-disable prettier/prettier */
import {
	Alert,
	Image,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	ActivityIndicator,
} from 'react-native';
import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import nodeApi from '../api/nodeApi';
import { resolveAuth } from '../actions/AuthActions';
import { getProfileInfo } from '../actions/EditProfileActions';
import NotAuthUser from '../components/NotAuthUser';

const ProfileScreen = (props) => {
	useEffect(() => {		
		const unsubscribe = navigation.addListener('focus', () => {
			getProfileInfo();
			console.log('Refreshed!');
		  });

		return unsubscribe;
	}, [navigation]);

	const { photo, isSigned, screenLoading, username, name, surname, getProfileInfo, navigation } = props;

	console.log('props', props);

	const createTwoButtonAlert = () => {
		Alert.alert(
			'Выход',
			'Вы уверены, что хотите выйти?',
			[
				{
					text: 'Нет',
					onPress: () => console.log('Cancel Pressed'),
					style: 'cancel',
				},
				{
					text: 'Да',
					onPress: () =>
						nodeApi
							.post('/logout', {})
							.then(() => {
								props.resolveAuth({ prop: 'toAuthFlow', value: true });
								props.resolveAuth({ prop: 'isSigned', value: false });
							})
							.catch((error) => console.log('ERROR', error)),
				},
			],
			{ cancelable: false },
		);
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

	if (!isSigned) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white' }}>
				<NotAuthUser />
			</View>
		);
	}

	if (screenLoading) {
		return (
			<View style={{ flex: 1, backgroundColor: 'white' }}>
				<ActivityIndicator size="large" color="#379683" style={{ flex: 1 }} />
			</View>
		);
	}
	return (
		<View style={{ flex: 1, backgroundColor: 'white' }}>
			
			<Avatar />
		
			<View style={{ flex: 1 }}>
				<View>
					<TouchableOpacity
						onPress={() => {
							props.navigation.navigate('EditProfile');
						}}
						style={styles.buttonStyle}
					>
						<View>
							<Text style={styles.buttonText}>Редактировать профиль</Text>
						</View>
					</TouchableOpacity>
					{/* <Ripple */}
					{/*	rippleDuration={700} */}
					{/*	onPress={() => { */}
					{/*		props.navigation.navigate('Help'); */}
					{/*	}} */}
					{/* > */}
					{/*	<View style={styles.menuButton}> */}
					{/*		<MaterialCommunityIcons */}
					{/*			name="help-rhombus" */}
					{/*			size={25} */}
					{/*			style={{ alignSelf: 'center' }} */}
					{/*		/> */}
					{/*		<Text style={styles.buttonText}>Помощь</Text> */}
					{/*	</View> */}
					{/* </Ripple> */}
					{/* <Ripple */}
					{/*	rippleDuration={700} */}
					{/*	onPress={() => { */}
					{/*		props.navigation.navigate('AboutUs'); */}
					{/*	}} */}
					{/* > */}
					{/*	<View style={styles.menuButton}> */}
					{/*		<MaterialCommunityIcons */}
					{/*			name="information" */}
					{/*			size={25} */}
					{/*			style={{ alignSelf: 'center' }} */}
					{/*		/> */}
					{/*		<Text style={styles.buttonText}>О нас</Text> */}
					{/*	</View> */}
					{/* </Ripple> */}
				</View>
				<View
					style={{
						flex: 1,
						marginLeft: 15,
					}}
				>
					<View style={styles.rowContainer}>
						<Text style={styles.rowName}>Имя пользователя:</Text>
						<Text style={styles.name}>
							{!username ? (
								<Text style={{ color: 'red' }}>Имя пользователя не доступно</Text>
							) : (
								username
							)}
						</Text>
					</View>
					<View style={styles.rowContainer}>
						<Text style={styles.rowName}>Имя:</Text>
						<Text style={styles.name}>
							{!name ? (
								<Text style={{ color: 'red' }}>Имя не заполнено</Text>
							) : (
								name
							)}
						</Text>
					</View>
					<View style={styles.rowContainer}>
						<Text style={styles.rowName}>Фамилия:</Text>
						<Text style={styles.name}>
							{!surname ? (
								<Text style={{ color: 'red' }}>Фамилия не заполнена</Text>
							) : (
								surname
							)}
						</Text>
					</View>
				</View>
				<View
					style={{
						flex: 1,
						justifyContent: 'flex-end',
						marginBottom: 15,
					}}
				>
					<TouchableOpacity onPress={createTwoButtonAlert} style={styles.buttonStyle}>
						<View>
							<Text style={styles.buttonText}>Выход</Text>
						</View>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	name: {
		fontSize: 18,
		marginLeft: 10,
		flex: 1,
	},
	rowName: { fontSize: 18, flex: 1 },
	rowContainer: { marginTop: 5, flexDirection: 'row' },
	buttonText: {
		fontSize: 18,
		textAlignVertical: 'center',
		textAlign: 'center',
		color: '#EB9156',
	},
	imageStyle: {
		borderColor: 'green',
		borderWidth: 1,
		borderRadius: 75,
		height: 120,
		width: 120,
		alignSelf: 'center',
		marginVertical: 15,
	},
	buttonStyle: {
		marginHorizontal: 5,
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
});

ProfileScreen.navigationOptions = () => ({ title: 'Профиль' });

const mapStateToProps = ({ auth, profile }) => {
	const { fistLaunchToken, isSigned } = auth;
	const { name, surname, username, screenLoading, photo } = profile;

	return { fistLaunchToken, isSigned, name, surname, username, screenLoading, photo };
};

export default connect(mapStateToProps, { resolveAuth, getProfileInfo })(ProfileScreen);
