import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import HTML from 'react-native-render-html';

const CatalogItemScreen = (props) => {
	console.log(props);
	const { route } = props;
	const articleTitle = route.params.item.name;
	const articleText = route.params.item.content;
	console.log('route', route.params);

	return (
		<ScrollView style={styles.container}>
			<Text>{articleTitle}</Text>
			<HTML source={{ html: articleText }} />
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

export default CatalogItemScreen;
