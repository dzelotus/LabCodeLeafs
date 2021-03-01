import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';

const LastScanScreen = (props) => {
	console.log('PROPS', props);
	const { navigation, route } = props;
	const { data } = route.params;

	useEffect(() => {
		navigation.setOptions({
			headerTruncatedBackTitle: 'Назад',
		});
	}, []);

	const renderItem = ({ item }) => {
		console.log('photo', item);

		const imageUrl = item.compressed_url ? item.compressed_url : item.image_url;
		const imageUrlReady = imageUrl
			.replace('/var/leafs_files/upload/', 'https://leafs-app.lab-code.com/upload/')
			.replace('/usr/src/leafs_files/upload/', 'https://leafs-app.lab-code.com/upload/');

		let status;
		let disease;

		if (item.result.is_plant) {
			status = item.result.plant;
			disease = item.result.disease;
		} else {
			status = 'Растение не обнаружено';
		}

		return (
			<View
				style={{
					paddingTop: 10,
					paddingHorizontal: 10,
				}}
			>
				<View
					style={{
						flexDirection: 'row',
						paddingBottom: 10,
					}}
				>
					<TouchableOpacity
						onPress={() =>
							navigation.navigate('LastScanFullscreen', {
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
					<View
						style={{
							paddingLeft: 10,
							justifyContent: 'center',
							flex: 1,
						}}
					>
						<Text style={{ fontWeight: 'bold' }}>Результат сканирования:</Text>
						<Text style={{ marginTop: 5 }}>{status}</Text>
						<Text style={{ marginTop: 5 }}>{disease}</Text>
					</View>
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
