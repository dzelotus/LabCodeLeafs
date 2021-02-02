import React, { useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import HTML from 'react-native-render-html';

const CatalogPlantScreen = (props) => {
	const { route } = props;
	console.log('route', route); // nav from plant get heal_content, nav from catalog get content
	const itemContent = route.params.item.content;

	useEffect(() => {
		props.navigation.setOptions({
			headerTitle: route.params.item.name,
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
		marginTop: 5,
		backgroundColor: '#f4f4f4',
	},
});

export default CatalogPlantScreen;
