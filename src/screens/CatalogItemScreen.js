import React from 'react';
import { View, Text } from 'react-native';

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

CatalogItemScreen.navigationOptions = ({ navigation }) => {
	const data = navigation.state.params.item;
	return {
		title: `${data.name}`,
	};
};

export default CatalogItemScreen;
