import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import nodeApi from '../api/nodeApi';

const NewsScreen = (props) => {
	const [newsData, setNewsData] = useState();

	useEffect(() => {
		const stackNavigator = props.navigation.dangerouslyGetParent();
		if (stackNavigator) {
			stackNavigator.setOptions({
				headerTitle: 'Статьи',
			});
		}

		nodeApi
			.get('/articles')
			.then((response) => setNewsData(response.data.data))
			.catch((error) => console.log(error));
	}, []);

	return (
		<View style={{ flex: 1 }}>
			<FlatList
				data={newsData}
				renderItem={(item) => {
					const { title } = item.item;
					const previewData = item.item.article_preview.blocks;
					const previewItem = previewData.map((item) => {
						return (
							<Text
								key={item.key}
								style={{
									borderBottomColor: '#379683',
									borderBottomWidth: 1,
									paddingVertical: 10,
								}}
							>
								{item.text}
							</Text>
						);
					});
					const date = item.item.insert_date;

					return (
						<View style={styles.articleContainer}>
							<View
								style={{
									borderBottomColor: '#379683',
									borderBottomWidth: 2,
								}}
							>
								<TouchableOpacity
									style={{
										flexDirection: 'row',
										justifyContent: 'space-between',
									}}
									onPress={() =>
										props.navigation.navigate('Article', { data: item.item })
									}
								>
									<Text
										style={{
											fontSize: 25,
											fontWeight: 'bold',
										}}
									>
										{title}
									</Text>
									<Icon
										name="chevron-right"
										size={20}
										style={{ alignSelf: 'center' }}
									/>
								</TouchableOpacity>
							</View>
							{previewItem}
							<Text style={{ textAlign: 'right' }}>{date}</Text>
						</View>
					);
				}}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	articleContainer: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 12,
		},
		shadowOpacity: 0.58,
		shadowRadius: 16.0,
		elevation: 5,
		borderRadius: 3,
		borderColor: '#000',
		backgroundColor: '#fff',

		justifyContent: 'center',
		marginTop: 10,
		marginHorizontal: 5,
		marginBottom: 10,
		padding: 5,
	},
});

export default NewsScreen;
