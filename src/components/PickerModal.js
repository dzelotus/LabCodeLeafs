/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useHeaderHeight } from '@react-navigation/stack';

const PickerModal = ({ plantsData, value, onValueChange, placeholder }) => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [term, setTerm] = useState('');

	console.log('Value', term);
	const result = plantsData
		? plantsData.find((obj) => {
				return obj.id === value;
		  })
		: null;

	const search = plantsData
		? plantsData.filter((item) => {
				return item.value === 'К';
		  })
		: null;
	console.log('Search', search);
	const headerHeight = useHeaderHeight();

	return (
		<View style={{ justifyContent: 'center', flex: 1, paddingLeft: 10 }}>
			<View>
				<TouchableOpacity onPress={() => setIsModalVisible(true)}>
					<Text>{result ? `${result.value}` : `${placeholder}`}</Text>
				</TouchableOpacity>
			</View>
			<View>
				<Modal
					visible={isModalVisible}
					onBackdropPress={() => setIsModalVisible(false)}
					backdropColor="transparent"
					hasBackdrop
				>
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
								onChangeText={(txt) => setTerm(txt)}
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
