import React, { useEffect } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';

const CatalogItemScreen = (props) => {
	const { route, navigation } = props;
	const list = route.params.data;
	console.log('ITEM LIST', props);

	useEffect(() => {
		navigation.setOptions({
			headerTitle: list.diseaseName,
		});
	});

	return (
		<ScrollView style={{ flex: 1 }}>
			<View style={{ flexDirection: 'row', marginHorizontal: 5 }}>
				<Image
					source={list.previewImage}
					style={{ height: 200, width: 200, flex: 1, margin: 5 }}
					resizeMode="contain"
				/>
				<Image
					source={list.images}
					style={{ height: 200, width: 200, flex: 1, margin: 5 }}
					resizeMode="contain"
				/>
			</View>
			<View style={{ marginHorizontal: 5 }}>
				<Text style={{ fontSize: 18, color: '#379683' }}>О болезни</Text>
				<Text style={{ marginHorizontal: 5 }}>{list.aboutDisease}</Text>
			</View>
			<View style={{ marginHorizontal: 5 }}>
				<Text style={{ fontSize: 18, color: '#379683' }}>Вредоносность</Text>
				<Text style={{ marginHorizontal: 5 }}>{list.harmfulness}</Text>
			</View>
			<View style={{ marginHorizontal: 5 }}>
				<Text style={{ fontSize: 18, color: '#379683' }}>
					Географическое распространение
				</Text>
				<Text style={{ marginHorizontal: 5, marginBottom: 10 }}>{list.geography}</Text>
			</View>
		</ScrollView>
	);
};

CatalogItemScreen.navigationOptions = ({ navigation }) => {
	const data = navigation.state.params.item;
	return {
		title: `${data.name}`,
	};
};

export default CatalogItemScreen;
