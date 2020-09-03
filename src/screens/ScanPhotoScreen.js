import React, { useState } from 'react';
import {
	View,
	StyleSheet,
	StatusBar,
	ImageBackground,
	ActivityIndicator,
	Text,
	Alert,
	Image,
} from 'react-native';
import { withNavigationFocus } from '@react-navigation/compat';
import { Button } from 'react-native-elements';
import GoBackButton from '../components/GoBackButton';
import { connect } from 'react-redux';
import { getCsrf } from '../actions/AuthActions';
import nodeApi from '../api/nodeApi';
import Modal from 'react-native-modal';
import { StackActions } from '@react-navigation/native';

const ScanPhotoScreen = (route) => {
	const fileURL = route.route.params.img.uri;
	const cleanURL = fileURL.replace('file:///', 'file:/');

	/*if (route.navigation.state.params.location) {
    location.current = route.navigation.state.params.location;
  }*/

	const [loading, setLoading] = useState(false);
	const [alertText, setAlertText] = useState('Загружаем фотографию на сервер');

	const getCsrf = () => {
		setLoading(true);
		nodeApi
			.get('/scans/new', {})
			.then((response) => {
				console.log('RESP_CSRF', response);
				/*route.getCsrf({
					prop: '_csrf',
					value: response.data.csrfToken,
				});*/

				postPhoto({ _csrf: response.data.csrfToken });
			})

			.catch((error) => {
				console.log('ERRR', error.response),
					setLoading(false),
					Alert.alert(error.response.data.message);
			});
	};

	const postPhoto = ({ _csrf }) => {
		let image = new FormData();
		image.append('image', {
			uri: cleanURL,
			name: 'image.jpg',
			type: 'image/jpg',
		});
		image.append('_csrf', _csrf);

		nodeApi
			.post('/scans', image, {
				headers: {
					Accept: 'application/json',
					'Content-Type': 'multipart/form-data',
				},
			})
			.then((response) => {
				console.log('RESPPHOTO', response);

				getScans({ id: response.data.data.scan_request_id });
			})
			.catch((error) => {
				console.log('ERROR PHOTO', error),
					setLoading(false),
					Alert.alert('Ошибка', 'Что-то пошло не так, попробуйте еще раз');
			});
	};
	let counter = 0;

	const getScans = ({ id }) => {
		return nodeApi
			.get('scans/' + id)
			.then((response) => {
				if (response.data.data.status === 'WAIT' && counter < 10) {
					console.log('WAIT', counter);
					counter = counter + 1;
					setTimeout(() => {
						getScans({
							id: response.data.data.id,
						});
						setAlertText('Выполняем сканирование');
					}, 1000);
				} else if (counter < 10) {
					setLoading(false);
					Alert.alert(
						'Обнаружено заражение ',

						response.data.data.result.disease,
					);
				} else {
					setLoading(false);
					Alert.alert(
						'',
						'Сканирование выполняется слишком долго, результат вы сможете увидеть в разделе "Последние сканирования" ',
					);

					const popAction = StackActions.pop(3);

					route.navigation.dispatch(popAction);
					route.navigation.navigate('Main');
				}
			})
			.catch((error) => console.log('RES ERROR', error));
	};

	const ScanPhoto = () => {
		if (loading === false) {
			return (
				<Button
					title="Сканировать"
					buttonStyle={{ margin: 15, backgroundColor: '#8DC34A' }}
					onPress={getCsrf}
				/>
			);
		} else {
			return null;
		}
	};

	return (
		<View style={styles.container}>
			{route.isFocused && (
				<>
					<StatusBar hidden={true} />
				</>
			)}
			<ImageBackground
				style={styles.image}
				imageStyle={{ resizeMode: 'contain' }}
				source={{
					uri: fileURL,
				}}>
				<View style={styles.backButtonContainer}>
					<GoBackButton nav={'ScanLeaf'} />
				</View>
				<View>
					<Modal isVisible={loading} animationIn="fadeIn">
						<View
							style={{
								height: 120,
								width: 200,
								backgroundColor: 'white',
								alignSelf: 'center',
								borderRadius: 25,
							}}>
							<ActivityIndicator
								size="large"
								style={{
									flex: 1,
									alignSelf: 'center',
									justifyContent: 'center',
								}}
								color="#8DC34A"
							/>

							<View
								style={{
									flex: 1,
									justifyContent: 'center',
									alignItems: 'center',
								}}>
								<Text
									style={{
										textAlign: 'center',
									}}>
									{alertText}
								</Text>
							</View>
						</View>
					</Modal>
				</View>

				<View style={styles.buttonContainer}>
					<ScanPhoto />
				</View>
			</ImageBackground>
		</View>
	);
};

const mapStateToProps = ({ auth }) => {
	const { _csrf } = auth;

	return { _csrf };
};

const styles = StyleSheet.create({
	container: {
		flex: 1,

		justifyContent: 'center',
	},

	buttonContainer: {
		alignSelf: 'flex-end',
		justifyContent: 'center',
	},

	backButtonContainer: {
		alignSelf: 'flex-start',
		justifyContent: 'center',
	},

	image: {
		flex: 1,
		resizeMode: 'center',
		justifyContent: 'space-between',
	},
});

export default connect(mapStateToProps, {
	getCsrf,
})(withNavigationFocus(ScanPhotoScreen));
