import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import getRNDraftJSBlocks from 'react-native-draftjs-render';

const ArticleScreen = (props) => {
	console.log(props);
	const { route } = props;
	const articleTitle = route.params.data.title;
	console.log('route', route);
	useEffect(() => {
		const stackNavigator = props.navigation.dangerouslyGetParent();

		if (stackNavigator) {
			stackNavigator.setOptions({
				headerTitle: articleTitle,
			});
		}
	});

	const atomicHandler = (item, imageData) => {
		const imageIndex = item.entityRanges[0].key;
		const imageUri = imageData[imageIndex].data;

		switch (item.type) {
			case 'atomic':
				return (
					<View key={item.key}>
						<Image
							style={{ width: 288, height: 161, marginBottom: 5 }}
							source={{ uri: imageUri.src }}
						/>
					</View>
				);
			default:
				return null;
		}
	};

	const draftState = route.params.data.article_text;

	const params = {
		contentState: draftState,
		customStyles,
		atomicHandler,
		textProps: {
			selectable: true,
		},
	};

	const blocks = getRNDraftJSBlocks(params);

	return <ScrollView style={styles.container}>{blocks}</ScrollView>;
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

const customStyles = StyleSheet.flatten({
	unstyled: {
		fontSize: 18,
		fontWeight: 'normal',
		letterSpacing: -0.75,
		lineHeight: 32,
		marginBottom: 21,
	},
	link: {
		color: '#c4170c',
		fontWeight: 'bold',
		textDecorationLine: 'none',
	},
	unorderedListItemContainer: {
		marginBottom: 16,
		position: 'relative',
	},
	unorderedListItemBullet: {
		marginRight: 18,
		position: 'relative',
		top: 14,
		width: 6,
		height: 6,
		alignSelf: 'flex-start',
	},
	'unordered-list-item': {
		fontSize: 18,
		lineHeight: 32,
		alignSelf: 'flex-start',
		flex: 1,
	},
	orderedListContainer: {
		marginBottom: 16,
	},
	orderedListItemNumber: {
		fontSize: 18,
		lineHeight: 32,
		marginRight: 11,
		alignSelf: 'flex-start',
		color: '#c4170c',
	},
	'ordered-list-item': {
		alignSelf: 'flex-start',
		fontSize: 18,
		lineHeight: 32,
		flex: 1,
	},
	'code-block': {
		backgroundColor: '#e2e2e2',
	},
	blockquote: {
		fontWeight: 'bold',
		color: '#333',
		lineHeight: 33,
		paddingTop: 24,
		marginBottom: 24,
		fontSize: 33,
		letterSpacing: -2,
	},
	viewAfterList: {
		marginBottom: 32,
	},
});

export default ArticleScreen;
