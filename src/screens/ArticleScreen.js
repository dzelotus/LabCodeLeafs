import React, { useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';

import HTML from 'react-native-render-html';

const ArticleScreen = (props) => {
	const { route } = props;
	console.log(route.params.data);
	const article = route.params.data.article_text;
	useEffect(() => {
		const stackNavigator = props.navigation.dangerouslyGetParent();
		if (stackNavigator) {
			stackNavigator.setOptions({
				headerTitle: route.params.data.title,
			});
		}
	});

	return (
		<ScrollView style={styles.container}>
			<HTML
				source={{ html: article }}
				tagsStyles={{
					b: { fontSize: 18, paddingBottom: 50 },
					p: { fontSize: 16, paddingBottom: 15 },
				}}
			/>
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

export default ArticleScreen;
