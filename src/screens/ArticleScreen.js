import React from 'react';
import { Text, /* View, StyleSheet, */ ScrollView } from 'react-native';
import getRNDraftJSBlocks from 'react-native-draftjs-render';

const ArticleScreen = (props) => {
	const { route } = props;
	const { title } = route.params.data;
	/* 	const articleData = route.params.data.article_text.blocks; */
	/* const articleImage = route.params.data.article_text.entityMap; */
	console.log('im', route.params);
	/* const ArticleText = () => {
		return articleData.map((item) => {
			console.log(item);
			return (
				<View key={item.key}>
					<Text>{item.text}</Text>
				</View>
			);
		});
	}; */

	const draftState = route.params;
	console.log(draftState);
	const params = {
		contentState: draftState,
		depthMargin: 32,
		textProps: {
			selectable: true,
		},
	};

	const blocks = getRNDraftJSBlocks(params);

	return (
		<ScrollView>
			<Text>{title}</Text>
			{blocks}
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

export default ArticleScreen;
