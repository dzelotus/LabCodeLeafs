import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';

import HTML from 'react-native-render-html';

const ArticleScreen = (props) => {
	console.log(props);
	const { route } = props;
	const article = route.params.data.article_preview;

	return (
		<ScrollView style={styles.container}>
			<HTML source={{ html: article }} />
		</ScrollView>
	);
};

/* const styles = StyleSheet.create({
	articleContainer: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 12,
		},
		shadowOpacity: 0.58,
		shadowRadius: 16.0,
		elevation: 7,
		borderRadius: 3,
		borderColor: '#000',
		backgroundColor: '#fff',

		justifyContent: 'center',
		marginTop: 10,
		margin: 5,
		padding: 5,
	},
}); */

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16,
		marginTop: 5,
		backgroundColor: '#f4f4f4',
	},
});

export default ArticleScreen;
