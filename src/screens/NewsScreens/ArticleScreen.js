/* 
Экран отображения новостной статьи
*/

import React, { useEffect } from 'react';
import { StyleSheet, ScrollView, useWindowDimensions, Dimensions } from 'react-native';
import HTML from 'react-native-render-html';

const ArticleScreen = (props) => {
	const { route } = props;
	const article = route.params.data.article_text;

	useEffect(() => {
		const stackNavigator = props.navigation.dangerouslyGetParent();
		if (stackNavigator) {
			stackNavigator.setOptions({
				headerTitle: route.params.data.title,
				headerTruncatedBackTitle: '',
			});
		}
	});

	const contentWidth = useWindowDimensions().width;
	const computeEmbeddedMaxWidth = (availableWidth) => {
		return Math.min(availableWidth, 500);
	};

	return (
		<ScrollView style={styles.container}>
			<HTML
				containerStyle={styles.htmlRender}
				source={{ html: article }}
				tagsStyles={{
					div: { flex: 1, fontSize: 16 },
					p: { fontSize: 16, paddingBottom: 15 },
					i: { fontSize: 16, fontWeight: 'bold' },
				}}
				contentWidth={contentWidth}
				computeEmbeddedMaxWidth={computeEmbeddedMaxWidth}
				ignoredStyles={['width']}
			/>
		</ScrollView>
	);
};

const wid = Dimensions.get('screen').width;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16,
		paddingBottom: 15,
		backgroundColor: 'white',
		width: wid,
	},
	htmlRender: {
		marginVertical: 15,
	},
});

export default ArticleScreen;
