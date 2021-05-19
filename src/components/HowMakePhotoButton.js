/* eslint-disable global-require */
/* Модальное окно с подсказкой по правильному фотографированию листа */

/* NPM */
import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Image, ScrollView } from 'react-native';
import { withNavigation } from '@react-navigation/compat';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HowMakePhotoButton = () => {
	const [showModal, setShowModal] = useState(false);

	return (
		<View>
			<TouchableOpacity onPress={() => setShowModal(true)} style={styles.showModalButton}>
				<Text style={styles.btnTitle}>Как правильно сделать фото?</Text>
			</TouchableOpacity>
			<Modal
				isVisible={showModal}
				hasBackdrop
				style={styles.modalStyle}
				propagateSwipe
				useNativeDriver={false}
			>
				<View style={styles.modalContainer}>
					<TouchableOpacity
						onPress={() => setShowModal(false)}
						style={styles.closeButton}
					>
						<Icon name="close" size={40} color="black" />
					</TouchableOpacity>
					<ScrollView>
						<Text style={styles.titleStyle}>Как правильно сделать фото?</Text>
						<View style={styles.textContainer}>
							<Text style={styles.textStyle}>
								1. Поместите лист или цветок в центр рамки. Постарайтесь сделать
								так, чтобы лист или цветок были четко видны на фото
							</Text>
							<View style={styles.caseContainer}>
								<View>
									<Image
										source={require('../../assets/howMakePhotoImages/1not.jpg')}
										style={styles.imageStyle}
									/>
									<Icon name="close" size={50} color="red" />
								</View>
								<View>
									<Image
										source={require('../../assets/howMakePhotoImages/1ok.jpg')}
										style={styles.imageStyle}
									/>
									<Icon name="check" size={50} color="green" />
								</View>
							</View>
							<Text style={styles.textStyle}>
								2. Постарайтесь сфотографировать один лист или цветок
							</Text>
							<View style={styles.caseContainer}>
								<View>
									<Image
										source={require('../../assets/howMakePhotoImages/2not.jpg')}
										style={styles.imageStyle}
									/>
									<Icon name="close" size={50} color="red" />
								</View>
								<View>
									<Image
										source={require('../../assets/howMakePhotoImages/2ok.jpg')}
										style={styles.imageStyle}
									/>
									<Icon name="check" size={50} color="green" />
								</View>
							</View>
							<Text style={styles.textStyle}>
								3. Фотографируйте лист или цветок, а не растение целиком
							</Text>
							<View style={styles.caseContainer}>
								<View>
									<Image
										source={require('../../assets/howMakePhotoImages/3not.jpg')}
										style={styles.imageStyle}
									/>
									<Icon name="close" size={50} color="red" />
								</View>
								<View>
									<Image
										source={require('../../assets/howMakePhotoImages/3ok.jpg')}
										style={styles.imageStyle}
									/>
									<Icon name="check" size={50} color="green" />
								</View>
							</View>
							<Text style={styles.textStyle}>
								4. Проследите, чтобы на фото был лист или цветок только одного
								растения
							</Text>
							<View style={styles.caseContainer}>
								<View>
									<Image
										source={require('../../assets/howMakePhotoImages/4not.jpg')}
										style={styles.imageStyle}
									/>
									<Icon name="close" size={50} color="red" />
								</View>
								<View>
									<Image
										source={require('../../assets/howMakePhotoImages/4ok.jpg')}
										style={styles.imageStyle}
									/>
									<Icon name="check" size={50} color="green" />
								</View>
							</View>
						</View>
					</ScrollView>
				</View>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	showModalButton: {
		marginTop: 15,
		borderWidth: 2,
		borderColor: '#379683',
		borderRadius: 10,
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'white',
	},
	btnTitle: { fontSize: 18, color: '#379683', marginHorizontal: 5 },
	modalStyle: {
		justifyContent: 'flex-end',
		margin: 0,
		paddingTop: 40,
	},
	modalContainer: {
		backgroundColor: 'white',
		paddingVertical: 40,
	},
	textContainer: {
		marginHorizontal: 10,
		marginTop: 10,
	},
	textStyle: {
		marginBottom: 10,
		fontSize: 18,
		textAlign: 'center',
	},
	titleStyle: {
		textAlign: 'center',
		fontSize: 18,
		fontWeight: 'bold',
		paddingTop: 20,
	},
	imageStyle: {
		height: 170,
		width: 170,
		zIndex: 100,
	},
	closeButton: { alignSelf: 'flex-end', paddingRight: 20 },
	caseContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 15,
	},
});

export default withNavigation(HowMakePhotoButton);
