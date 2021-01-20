/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const PickerModal = ({ plantsData, value, onValueChange, placeholder }) => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [data, setData] = useState('');

	console.log('Value', plantsData);
	useEffect(() => {
		setData(plantsData);
	}, []);

	const result = plantsData
		? plantsData.find((obj) => {
				return obj.id === value;
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

	return (
		<View>
			<View>
				<TouchableOpacity
					onPress={() => {
						setIsModalVisible(true);
					}}
				>
					<Text>{result ? `${result.value}` : `${placeholder}`}</Text>
				</TouchableOpacity>
			</View>
			<View>
				<Modal isVisible={isModalVisible} onBackdropPress={() => setIsModalVisible(false)}>
					<View>
						<View style={styles.modalContainer}>
							<TouchableOpacity
								onPress={() => setIsModalVisible(false)}
								style={{
									alignSelf: 'flex-end',
									marginTop: 10,
									marginRight: 10,
								}}
							>
								<MaterialCommunityIcons name="close" size={30} />
							</TouchableOpacity>
							<View style={{ marginBottom: 15 }}>
								<Text
									style={{
										textAlign: 'center',
										textAlignVertical: 'center',
										fontSize: 22,
									}}
								>
									{placeholder}
								</Text>
							</View>
							<View style={{ width: '99%', paddingHorizontal: 10 }}>
								<TextInput
									style={{
										borderBottomColor: 'gray',
										borderBottomWidth: 1,
									}}
									placeholder="Поиск растения"
									onChangeText={(txt) => searchFunc(txt)}
								/>
							</View>
							<View
								style={{
									height: 300,
									width: '99%',
									padding: 10,
								}}
							>
								<FlatList
									data={data}
									renderItem={(item) => {
										const plantName = item.item.value;

										return (
											<TouchableOpacity
												onPress={() => {
													onValueChange(item.item.id);
													setIsModalVisible(false);
												}}
											>
												<Text style={{ fontSize: 18, marginBottom: 10 }}>
													{plantName}
												</Text>
											</TouchableOpacity>
										);
									}}
								/>
							</View>
						</View>
					</View>
				</Modal>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	modalContainer: {
		margin: 15,
		backgroundColor: 'white',
		borderRadius: 5,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
});

export default PickerModal;
