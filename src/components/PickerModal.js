/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, FlatList, TextInput } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useHeaderHeight } from '@react-navigation/stack';

const PickerModal = ({ plantsData, value, onValueChange, placeholder }) => {
	const [isModalVisible, setIsModalVisible] = useState(false);

	console.log('Value', value);
	const result = plantsData
		? plantsData.find((obj) => {
				return obj.id === value;
		  })
		: null;
	console.log('Obj', result);
	const headerHeight = useHeaderHeight();

	return (
		<View>
			<View style={{ flexDirection: 'row' }}>
				<TouchableOpacity onPress={() => setIsModalVisible(true)}>
					<Text>{result ? `${result.value}` : `${placeholder}`}</Text>
				</TouchableOpacity>
			</View>
			<View
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					flex: 1,
				}}
			>
				<Modal visible={isModalVisible} transparent>
					<View style={{ marginTop: headerHeight }}>
						<View style={styles.modalContainer}>
							<TouchableOpacity
								onPress={() => setIsModalVisible(false)}
								style={{
									alignSelf: 'flex-end',
									marginBottom: 10,
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
										fontSize: 18,
									}}
								>
									{placeholder}
								</Text>
							</View>
							<TextInput
								style={{
									borderBottomColor: 'gray',
									borderBottomWidth: 1,
									width: '99%',
								}}
								placeholder="Поиск растения"
							/>
							<View
								style={{
									height: 300,
									width: '99%',
									padding: 10,
								}}
							>
								<FlatList
									data={plantsData}
									renderItem={(item) => {
										const plantName = item.item.value;

										return (
											<TouchableOpacity
												onPress={() => {
													onValueChange(item.item.id);
													setIsModalVisible(false);
												}}
											>
												<Text>{plantName}</Text>
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
