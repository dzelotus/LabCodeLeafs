/* eslint-disable prettier/prettier */

/* Экран профиля */

/* NPM */
import {
	Alert,
	Image,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,	
	Button
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import FontistoIcon from 'react-native-vector-icons/Fontisto';

/* OTHER */
import nodeApi from '../../api/nodeApi';
import { resolveAuth, refreshConnection } from '../../actions/AuthActions';
import NotAuthUser from '../../components/NotAuthUser';
import Indicator from '../../components/Indicator';


const ProfileScreen = (props) => {	
	const [profile, setProfile] = useState(null)
	const [loading, setLoading] = useState(false)

	useEffect(() => {		
		const unsubscribe = navigation.addListener('focus', () => {			
			getProfile();
			refreshConnection();
			console.log('Refreshed!');
		  });

		return unsubscribe;
	}, [navigation]);

	const getProfile = () => {
		setLoading(true)
		nodeApi
			.get('/profile')
			.then(async (response) => {
				console.log('FUNC RESP', response.data.data)				
				setProfile({
					name: response.data.data.name,
					surname: response.data.data.surname,
					username: response.data.data.username,
					userPhoto: response.data.data.profile_image
				})			
				setLoading(false)
			})
			.catch(() => setLoading(false));
	}

	const { isSigned, navigation, checkInternet, refreshConnection, resolveAuth } = props;

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
		if(profile.userPhoto) {
			const photoUri = profile.userPhoto
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
	const checkVerify = async () => {
		nodeApi
			.get('user_authentication')
			.then((response) => {
				if (response.data.data) {
					resolveAuth({ prop: 'isSigned', value: true });
				}
				
			})
			.catch((error) => {
				console.log('USER AUTH ERR', error);
			});
	};

	if (!isSigned && checkInternet) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white' }}>
				<NotAuthUser />
			</View>
		);
	}

	if (!checkInternet) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: 'white',
				}}
			>
				<Text style={{ fontSize: 18, textAlign: 'center' }}>
					Для доступа к разделу требуется подключение к интернету
				</Text>
				<Button
					title="Обновить"
					onPress={() => {
						console.log('Хочу интернет');
						refreshConnection();
						checkVerify();
					}}
				/>
			</View>
		);
	}

	if (loading || !profile) {
		return (
			<Indicator style={{
				backgroundColor: 'white',
				flex: 1,
			}}
			/>
		);
	}
	return (
		<View style={{ flex: 1, backgroundColor: 'white' }}>			
			<Avatar />		
			<View style={{ flex: 1 }}>
				<View>
					<TouchableOpacity
						onPress={() => {
							props.navigation.navigate('EditProfile', {profile});
						}}
						style={styles.buttonStyle}
					>
						<View>
							<Text style={styles.buttonText}>Редактировать профиль</Text>
						</View>
					</TouchableOpacity>
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
							{!profile.username ? (
								<Text style={{ color: 'red' }}>Имя пользователя не доступно</Text>
							) : (
								profile.username
							)}
						</Text>
					</View>
					<View style={styles.rowContainer}>
						<Text style={styles.rowName}>Имя:</Text>
						<Text style={styles.name}>
							{!profile.name ? (
								<Text style={{ color: 'red' }}>Имя не заполнено</Text>
							) : (
								profile.name
							)}
						</Text>
					</View>
					<View style={styles.rowContainer}>
						<Text style={styles.rowName}>Фамилия:</Text>
						<Text style={styles.name}>
							{!profile.surname ? (
								<Text style={{ color: 'red' }}>Фамилия не заполнена</Text>
							) : (
								profile.surname
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


const mapStateToProps = ({ auth }) => {
	const { isSigned, checkInternet, startWithoutInternet } = auth;

	return { isSigned, checkInternet, startWithoutInternet };
};

export default connect(mapStateToProps, {
	resolveAuth,	
	refreshConnection,
})(ProfileScreen);

