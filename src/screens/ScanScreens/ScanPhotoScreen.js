/* Экран после фотографирования или выбора фото из галереи. Фото открывается на весь экран. 
Имеется возможность отправить на обработку
 */

/* NPM */
import React, { useState } from 'react';
import { View, StyleSheet, StatusBar, ImageBackground, Text, Alert, Platform } from 'react-native';
import { withNavigationFocus } from '@react-navigation/compat';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';

/* OTHER */
import GoBackButton from '../../components/GoBackButton';
import { getCsrf } from '../../actions/AuthActions';
import nodeApi from '../../api/nodeApi';
import Indicator from '../../components/Indicator';

const ScanPhotoScreen = (route) => {
	const fileURL = route.route.params.img.uri;
	const cleanURL = fileURL.replace('file:///', 'file:/');

	const [loading, setLoading] = useState(false);

	const getCsrf = () => {
		setLoading(true);
		nodeApi
			.get('/scans/new', {})
			.then((response) => {
				postPhoto({ _csrf: response.data.csrfToken });
			})

			.catch((error) => {
				console.log('ERRR', error.response);
				setLoading(false);
				Alert.alert(error.response.data.message);
			});
	};

	const postPhoto = ({ _csrf }) => {
		console.log('POST START');
		const image = new FormData();
		image.append('image', {
			uri: cleanURL,
			name: 'image.jpg',
			type: 'image/jpg',
		});
		image.append('_csrf', _csrf);
		console.log('SENDED');
		nodeApi
			.post('/scans', image, {
				headers: {
					Accept: 'application/json',
					'Content-Type': 'multipart/form-data',
				},
			})
			.then((response) => {
				console.log('RESPPHOTO', response);
				setLoading(false);
				if (response.data.data.ai_scan_response.is_plant) {
					route.navigation.navigate('LastScanFullscreenPhoto', {
						scansData: response.data,
					});
				} else {
					Alert.alert(
						'Ошибка',
						'Не получается распознать растение или растение не обнаружено, попробуйте другое фото',
						[{ text: 'OK', onPress: () => route.navigation.pop() }],
					);
				}
			})
			.catch((error) => {
				console.log('ERROR PHOTO', error.response);
				setLoading(false);
				Alert.alert('Ошибка', 'Что-то пошло не так, попробуйте еще раз');
			});
	};

	const ScanPhoto = () => {
		if (loading === false) {
			return (
				<Button
					title="Сканировать"
					buttonStyle={{ margin: 15, backgroundColor: '#379683' }}
					onPress={getCsrf}
				/>
			);
		}
		return null;
	};

	return (
		<View style={styles.container}>
			{route.isFocused && (
				<>
					<StatusBar hidden />
				</>
			)}
			<ImageBackground
				style={styles.image}
				imageStyle={{ resizeMode: 'contain' }}
				source={{
					uri: fileURL,
				}}
			>
				<View style={styles.backButtonContainer}>
					<GoBackButton nav="ScanLeaf" />
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
							}}
						>
							<Indicator
								style={{
									flex: 1,
									alignSelf: 'center',
									justifyContent: 'center',
								}}
							/>

							<View
								style={{
									flex: 1,
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								<Text
									style={{
										textAlign: 'center',
									}}
								>
									Загружаем фотографию на сервер
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

const padding = Platform.OS === 'ios' ? 50 : 0;

const styles = StyleSheet.create({
	container: {
		flex: 1,

		justifyContent: 'center',
	},

	buttonContainer: {
		alignSelf: 'flex-end',
		justifyContent: 'center',
		paddingBottom: padding,
	},

	backButtonContainer: {
		position: 'absolute',
		top: 0,
		left: 15,
		paddingTop: padding,
		zIndex: 100,
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
