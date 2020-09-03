import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const CatalogItemScreen = ({ route }) => {
	const list = route.params.item;
	console.log('ITEM', list);

	return (
		<View>
			<Text>{list.name}</Text>
			<Text>{list.alternativeName}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	textStyle: {
		height: 50,
		margin: 10,
		backgroundColor: '#009599',
		borderRadius: 15,
		textAlign: 'center',
		textAlignVertical: 'center',
		fontSize: 20,
	},
});

CatalogItemScreen.navigationOptions = ({ navigation }) => {
	const data = navigation.state.params.item;
	return {
		title: `${data.name}`,
	};
};

export default CatalogItemScreen;
