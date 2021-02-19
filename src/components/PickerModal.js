/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform } from 'react-native';

import Modal from 'react-native-modal';


const PickerModal = ({ plantsData, value, onValueChange, placeholder }) => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [data, setData] = useState(plantsData);

	const result = plantsData ?
		plantsData.find((obj) => {
			const toComapare = value.toString();
			return obj.id === toComapare;
		  }) :
		null;

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
						setData(plantsData)
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
						paddingTop: 50
					}}
					propagateSwipe
				>			
					<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : null}>	
						<View style={styles.modalContainer}>	
							<View
								style={{
									height: 25,
									justifyContent: 'center',
								}}
							>
								<View
									style={{
										borderColor: '#379683',
										borderWidth: 3,
										marginHorizontal: 50,
										borderRadius: 3,
									}}
								/>
							</View>					
							<View style={{ marginBottom: 15 }}>
								<Text
									style={{
										textAlign: 'center',
										textAlignVertical: 'center',
										fontSize: 22,
										color: '#FF9800'
									}}
								>
									{placeholder}
								</Text>
							</View>
							<View style={{  paddingHorizontal: 10, paddingBottom: 10  }}>
								<TextInput
									style={{
										borderBottomColor: 'gray',
										borderBottomWidth: 1,
										height: 50
									}}
									placeholder="Поиск растения"
									onChangeText={(txt) => searchFunc(txt)}
								/>
							</View>
							<View style={{  paddingHorizontal: 10, flex: 1 }}>
								<FlatList
									data={data}
									keyboardShouldPersistTaps='always'																	
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
		paddingBottom: 35,			
		height: 400,		
	},
});

export default PickerModal;
