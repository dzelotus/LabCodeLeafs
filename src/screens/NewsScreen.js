import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import nodeApi from '../api/nodeApi';

const NewsScreen = (props) => {
	const [newsData, setNewsData] = useState();

	useEffect(() => {
		nodeApi
			.get('/articles')
			.then((response) => setNewsData(response.data.data))
			.catch((error) => console.log(error));
	}, []);
	console.log('NEWS', newsData);

	return (
		<View>
			<FlatList
				data={newsData}
				renderItem={(item) => {
					console.log(item.item.insert_date);
					const { title } = item.item;
					const previewData = item.item.article_preview.blocks;
					const previewItem = previewData.map((item) => {
						return (
							<Text
								key={item.key}
								style={{
									borderBottomColor: '#8DC34A',
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
									borderBottomColor: '#8DC34A',
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
		elevation: 7,
		borderRadius: 3,
		borderColor: '#000',
		backgroundColor: '#fff',

		justifyContent: 'center',
		marginTop: 10,
		margin: 5,
		padding: 5,
	},
});

export default NewsScreen;
