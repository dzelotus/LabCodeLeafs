import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';

const LastScanScreen = (route) => {
	const [disease, setDisease] = useState('');

	const data = route.route.params.data;

	const renderItem = ({ item }) => {
		let image_url = item.image_url;
		let image_url_ready = image_url
			.replace('/var/leafs_files/upload/', 'https://leafs-app.lab-code.com/upload/')
			.replace(
				'\\\\172.16.0.5\\Share\\leafs_files\\upload\\',
				'https://leafs-app.lab-code.com/upload/',
			);

		if (item.result) {
			setDisease(item.result.disease);
		} else {
			setDisease('Ждем обработку');
		}

		return (
			<View
				style={{
					marginTop: 15,
					marginLeft: 15,
				}}>
				<View style={{ flexDirection: 'row' }}>
					<Text>{disease}</Text>
				</View>

				<View style={{ paddingTop: 10 }}>
					<TouchableOpacity
						onPress={() =>
							route.navigation.navigate('LastScanFullscreenPhoto', {
								uri: image_url_ready,
							})
						}>
						<FastImage
							resizeMode="contain"
							style={{
								height: 200,
								width: 200,
							}}
							source={{ uri: image_url_ready }}
						/>
					</TouchableOpacity>
				</View>
			</View>
		);
	};

	return (
		<View>
			<Text
				style={{
					textAlign: 'center',
					marginTop: 10,
					fontWeight: 'bold',
					fontSize: 15,
				}}>
				Последние 10 сканирований
			</Text>
			<FlatList
				data={data}
				keyExtractor={(item) => item.id}
				removeClippedSubviews={true}
				renderItem={renderItem}
				windowSize={10}
				initialNumToRender={2}
			/>
		</View>
	);
};

export default LastScanScreen;
