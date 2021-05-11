/* 
Экран отображения статьи про методы лечения в справочнике
*/

import React, { useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import HTML from 'react-native-render-html';

const CatalogPlantScreen = (props) => {
	const { route } = props;
	const itemContent = route.params.item.content;

	useEffect(() => {
		props.navigation.setOptions({
			headerTitle: route.params.item.name,
			headerTruncatedBackTitle: '',
		});
	}, []);

	return (
		<ScrollView style={styles.container}>
			<HTML source={{ html: itemContent }} />
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16,
		backgroundColor: 'white',
	},
});

export default CatalogPlantScreen;
