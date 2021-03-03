import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { withNavigation } from '@react-navigation/compat';
import Modal from 'react-native-modal';
import { ScrollView } from 'react-native-gesture-handler';

const HowMakePhotoButton = () => {
	const [showModal, setShowModal] = useState(false);

	return (
		<View>
			<TouchableOpacity onPress={() => setShowModal(true)} style={styles.showModalButton}>
				<Text style={{ fontSize: 18, color: '#379683', marginHorizontal: 5 }}>
					Как правильно сделать фото?
				</Text>
			</TouchableOpacity>
			<Modal
				isVisible={showModal}
				hasBackdrop
				onBackdropPress={() => setShowModal(false)}
				onSwipeComplete={() => setShowModal(false)}
				onSwipeCancel={() => null}
				swipeDirection="down"
				style={{
					justifyContent: 'flex-end',
					margin: 0,
				}}
			>
				<View
					style={{
						borderColor: '#ffffff',
						borderWidth: 3,
						marginHorizontal: 50,
						borderRadius: 3,
						marginBottom: 10,
						width: 45,
						alignSelf: 'center',
					}}
				/>
				<View style={styles.modalContainer}>
					<View
						style={{
							height: 25,
							justifyContent: 'center',
						}}
					/>
					<ScrollView style={{ marginTop: 10 }}>
						<Text style={styles.titleStyle}>Как правильно сделать фото?</Text>
						<View style={styles.textContainer}>
							<Text style={styles.textStyle}>
								1. Поместите лист растения в центр рамки
							</Text>
							<Text style={styles.textStyle}>
								2. Если не получается поместить в рамку только один лист,
								постарайтесь сделать так, чтобы хотя бы один лист был четко виден в
								центре рамки
							</Text>
							<Text style={styles.textStyle}>
								3. На фото должен быть лист только одного растения
							</Text>
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
	modalContainer: {
		backgroundColor: 'white',
		borderTopRightRadius: 25,
		borderTopLeftRadius: 25,
		paddingBottom: 100,
	},
	textContainer: {
		marginHorizontal: 10,
		marginTop: 10,
	},
	textStyle: {
		marginBottom: 10,
		fontSize: 16,
	},
	titleStyle: {
		textAlign: 'center',
		fontSize: 18,
		fontWeight: 'bold',
	},
});

export default withNavigation(HowMakePhotoButton);
