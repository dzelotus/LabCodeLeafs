import React, { useEffect, useState } from 'react';
import {
	Text,
	View,
	FlatList,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HTML from 'react-native-render-html';
import nodeApi from '../api/nodeApi';

const NewsScreen = (props) => {
	const [newsData, setNewsData] = useState('');
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const stackNavigator = props.navigation.dangerouslyGetParent();
		if (stackNavigator) {
			stackNavigator.setOptions({
				headerTitle: 'Статьи',
			});
		}

		getNews();
	}, []);

	const getNews = () => {
		nodeApi
			.get('/articles')
			.then((response) => {
				console.log('NEWS FROM NEWS', response.data.data);
				setNewsData(response.data.data);
				setLoading(false);
			})
			.catch((error) => {
				console.log(error);
				setLoading(false);
			});
	};

	const Indicator = () => (
		<View style={{ alignSelf: 'center', flex: 1 }}>
			<ActivityIndicator size="large" color="#379683" style={{ flex: 1 }} />
		</View>
	);

	if (loading) {
		return <Indicator />;
	}
	return (
		<View style={{ flex: 1 }}>
			<FlatList
				data={newsData}
				renderItem={(item) => {
					const { title } = item.item;
					const previewData = item.item.article_preview;
					const date = item.item.insert_date;
					console.log('ITTTTT', previewData);

					return (
						<View style={styles.articleContainer}>
							<View>
								<TouchableOpacity
									onPress={() =>
										props.navigation.navigate('Article', { data: item.item })
									}
								>
									<View
										style={{
											flexDirection: 'row',
											justifyContent: 'space-between',
											borderBottomColor: '#379683',
											borderBottomWidth: 2,
										}}
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
									</View>
									<HTML
										source={{ html: previewData }}
										tagsStyles={{
											p: { fontSize: 16, paddingVertical: 10 },
										}}
									/>
									<Text style={{ textAlign: 'right' }}>{date}</Text>
								</TouchableOpacity>
							</View>
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
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
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
