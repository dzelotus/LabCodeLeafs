import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';

const LastScanScreen = (route) => {
	const { data } = route.route.params;

	const renderItem = ({ item }) => {
		let status;
		const imageUrl = item.image_url;
		const imageUrlReady = imageUrl
			.replace('/var/leafs_files/upload/', 'https://leafs-app.lab-code.com/upload/')
			.replace('/usr/src/leafs_files/upload/', 'https://leafs-app.lab-code.com/upload/');

		console.log('STATUS', item);

		if (item.result === null) {
			status = 'Ошибка сканирования фотографии';
		} else if (item.result.status === 'ERROR') {
			status = 'Ошибка сканирования фотографии';
		} else {
			status = item.result.disease;
		}

		return (
			<View
				style={{
					marginTop: 15,
					marginLeft: 15,
				}}
			>
				<View style={{ flexDirection: 'row' }}>
					<Text>{status}</Text>
				</View>

				<View style={{ paddingTop: 10 }}>
					<TouchableOpacity
						onPress={() =>
							route.navigation.navigate('LastScanFullscreen', {
								screen: 'LastScanFullscreenPhoto',
								params: { uri: imageUrlReady, route: 'LastScan', show: true },
							})
						}
					>
						<FastImage
							resizeMode="contain"
							style={{
								height: 200,
								width: 200,
							}}
							source={{ uri: imageUrlReady }}
						/>
					</TouchableOpacity>
				</View>
			</View>
		);
	};

	return (
		<View style={{ flex: 1, marginBottom: 10 }}>
			<Text
				style={{
					textAlign: 'center',
					marginTop: 10,
					fontWeight: 'bold',
					fontSize: 15,
				}}
			>
				Последние 10 сканирований
			</Text>
			<FlatList
				data={data}
				keyExtractor={(item) => item.id}
				removeClippedSubviews
				renderItem={renderItem}
				windowSize={10}
			/>
		</View>
	);
};

export default LastScanScreen;
