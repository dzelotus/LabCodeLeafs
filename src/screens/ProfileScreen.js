import { Alert, Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import Ripple from 'react-native-material-ripple';
import { connect } from 'react-redux';
import nodeApi from '../api/nodeApi';
import { resolveAuth } from '../actions/AuthActions';
import { getProfileInfo } from '../actions/EditProfileActions';
import NotAuthUser from '../components/NotAuthUser';

const ProfileScreen = (route) => {
	useEffect(() => {
		route.getProfileInfo();
	}, []);

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
								route.resolveAuth({ prop: 'toAuthFlow', value: true });
								route.resolveAuth({ prop: 'isSigned', value: false });
							})
							.catch((error) => console.log('ERROR', error)),
				},
			],
			{ cancelable: false },
		);
	};

	if (!route.isSigned) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white' }}>
				<NotAuthUser />
			</View>
		);
	}

	return (
		<View style={{ flex: 1, backgroundColor: 'white' }}>
			<View
				style={{
					flexDirection: 'column',
					paddingLeft: 10,
				}}
			>
				<Image
					style={styles.imageStyle}
					source={{
						uri:
							'data:image/png;base64,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',
					}}
				/>
			</View>
			<View style={{ flex: 1 }}>
				<View>
					<Ripple
						rippleDuration={700}
						onPress={() => {
							route.navigation.navigate('EditProfile');
						}}
						style={styles.menuButton}
					>
						<View>
							<Text style={styles.buttonText}>Редактировать профиль</Text>
						</View>
					</Ripple>
					{/* <Ripple */}
					{/*	rippleDuration={700} */}
					{/*	onPress={() => { */}
					{/*		route.navigation.navigate('Help'); */}
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
					{/*		route.navigation.navigate('AboutUs'); */}
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
						alignSelf: 'center',
					}}
				>
					<Text style={styles.name}>
						{!route.name ? (
							<Text style={{ color: 'red' }}>Имя не заполнено</Text>
						) : (
							route.name
						)}
					</Text>
					<Text style={styles.name}>
						{!route.surname ? (
							<Text style={{ color: 'red' }}>Фамилия не заполнена</Text>
						) : (
							route.surname
						)}
					</Text>
				</View>
				<View
					style={{
						flex: 1,
						justifyContent: 'flex-end',
						marginBottom: 15,
					}}
				>
					<TouchableOpacity onPress={createTwoButtonAlert} style={styles.menuButton}>
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
		fontWeight: 'bold',
		marginTop: 10,
	},
	menuButton: {
		flexDirection: 'column',
		justifyContent: 'center',
		marginRight: 55,
		marginLeft: 55,
		paddingLeft: 10,
		height: 35,
		backgroundColor: '#116B58',
		borderRadius: 5,
	},
	buttonText: {
		fontSize: 18,
		textAlignVertical: 'center',
		textAlign: 'center',
		color: '#FFFFFF',
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
		height: 50,
		justifyContent: 'center',
	},
});

ProfileScreen.navigationOptions = () => ({ title: 'Профиль' });

const mapStateToProps = ({ auth, profile }) => {
	const { fistLaunchToken, isSigned } = auth;
	const { name, surname } = profile;

	return { fistLaunchToken, isSigned, name, surname };
};

export default connect(mapStateToProps, { resolveAuth, getProfileInfo })(ProfileScreen);
