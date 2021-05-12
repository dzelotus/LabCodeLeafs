/* Экран отображения последних выполненных сканирований */

/* NPM */
import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

const LastScanScreen = (props) => {
	const { navigation, route } = props;
	const { data } = route.params;

	useEffect(() => {
		navigation.setOptions({
			headerTruncatedBackTitle: 'Назад',
		});
	}, []);

	const renderItem = ({ item }) => {
		console.log('photo', item);

		const imageUrl = item.compressed_url;
		const imageUrlReady = imageUrl
			.replace('/var/leafs_files/upload/', 'https://api.leafs.pro/upload/')
			.replace('/usr/src/leafs_files/upload/', 'https://api.leafs.pro/upload/');

		let status;
		let disease;

		if (item.result.is_plant) {
			status = item.plant_name;
			disease = item.disease_name === null ? 'Болезни не обнаружены' : item.disease_name;
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
					<FastImage
						resizeMode="contain"
						style={{
							height: 200,
							width: 200,
						}}
						source={{ uri: imageUrlReady }}
					/>
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
						<TouchableOpacity
							style={styles.buttonStyle}
							onPress={() =>
								navigation.navigate('LastScanFullscreenPhoto', {
									data: item,
								})
							}
						>
							<Text>Подробнее</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		);
	};

	return (
		<View style={{ flex: 1, paddingBottom: 10, backgroundColor: 'white' }}>
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

const styles = StyleSheet.create({
	buttonStyle: {
		marginHorizontal: 5,
		marginVertical: 10,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		borderRadius: 10,
		borderColor: '#379683',
		borderWidth: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default LastScanScreen;
