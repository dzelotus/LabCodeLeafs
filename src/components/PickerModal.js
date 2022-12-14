/* eslint-disable operator-linebreak */
/* eslint-disable indent */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	TextInput,
	KeyboardAvoidingView,
	Platform,
	Dimensions,
	useWindowDimensions,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import Modal from 'react-native-modal';

const PickerModal = ({ plantsData, value, onValueChange, placeholder }) => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [data, setData] = useState(plantsData);

	const result = plantsData
		? plantsData.find((obj) => {
				const toComapare = value.toString();
				return obj.id === toComapare;
		  })
		: null;

	const searchFunc = (text) => {
		const search = plantsData.filter((item) => {
			const valueToLowercase = item.value.toLowerCase();
			const searchTermToLowercase = text.toLowerCase();

			return valueToLowercase.indexOf(searchTermToLowercase) > -1;
		});
		setData(search);
	};

	const MapData = () =>
		data.map((item) => {
			console.log('IT', item);
			return (
				<TouchableOpacity
					onPress={() => {
						onValueChange(item.id);
						setIsModalVisible(false);
					}}
					key={item.id}
				>
					<Text
						style={{
							fontSize: 18,
							marginBottom: 10,
						}}
					>
						{item.value}
					</Text>
				</TouchableOpacity>
			);
		});

		const minusHeight = Platform.OS === 'ios' ? 560 : 500
		const padBot = Platform.OS === 'ios' ? 30 : 10

	return (
		<View>
			<View>
				<TouchableOpacity
					onPress={() => {
						setData(plantsData);
						setIsModalVisible(true);
					}}
				>
					<Text>{result ? `${result.value}` : `${placeholder}`}</Text>
				</TouchableOpacity>
			</View>
			<View>
				<Modal
					isVisible={isModalVisible}
					onBackdropPress={() => setIsModalVisible(false)}
					onSwipeComplete={() => setIsModalVisible(false)}
					swipeDirection="down"
					style={{
						justifyContent: 'flex-end',
						margin: 0,
						paddingTop: 30,
					}}
					propagateSwipe
				>
					<KeyboardAvoidingView
						behavior={Platform.OS === 'ios' ? 'padding' : null}
						style={{
							justifyContent: 'flex-end',
							maxHeight: useWindowDimensions().height - 75,
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
							<View>
								<View style={{ marginBottom: 15 }}>
									<Text
										style={{
											textAlign: 'center',
											textAlignVertical: 'center',
											fontSize: 22,
											color: '#FF9800',
										}}
									>
										{placeholder}
									</Text>
								</View>
								<View
									style={{
										paddingHorizontal: 10,
										paddingBottom: 10,
									}}
								>
									<TextInput
										style={{
											borderBottomColor: 'gray',
											borderBottomWidth: 1,
											height: 50,
										}}
										placeholder="?????????? ????????????????"
										onChangeText={(txt) => searchFunc(txt)}
									/>
								</View>

								<ScrollView
									style={{
										paddingHorizontal: 10,
										marginBottom: padBot,										
										maxHeight: useWindowDimensions().height - minusHeight,
									}}
								>
									<MapData />
								</ScrollView>
							</View>
						</View>
					</KeyboardAvoidingView>
				</Modal>
			</View>
		</View>
	);
};


const styles = StyleSheet.create({
	modalContainer: {
		backgroundColor: 'white',
		borderTopLeftRadius: 25,
		borderTopRightRadius: 25,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		maxHeight: Dimensions.get('window').height - 100,
	},
});

export default PickerModal;
