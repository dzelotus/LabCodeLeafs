import React, { useEffect, useState } from 'react';
import {
	Image,
	View,
	StyleSheet,
	Text,
	Alert,
	TouchableOpacity,
	ScrollView,
	Dimensions,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import nodeApi from '../api/nodeApi';

const LastScanFullscreenPhotoScreen = (props) => {
	const [stateData, setStateData] = useState(null);

	const { route } = props;

	const getLastScans = async (scanId) => {
		await nodeApi
			.get(`/scans/${scanId}`)
			.then((response) => {
				console.log('SCAN', response.data.data);
				setStateData(response.data.data);
			})

			.catch(() => Alert.alert('Ошибка', 'Что-то пошло не так, перезагрузите приложение'));
	};

	useEffect(() => {
		if (route.params.data) {
			setStateData(route.params.data);
		} else {
			const scanId = props.route.params.scansData.data.scan_id;

			getLastScans(scanId);
		}
		props.navigation.setOptions({
			headerTruncatedBackTitle: 'Назад',
		});
	}, []);

	const getPlant = () => {
		nodeApi
			.get(`/plant-protection/plant/${stateData.plant_id}`)
			.then((response) => {
				console.log('RESP', JSON.stringify(response, null, 2));
				props.navigation.navigate('Catalog', {
					screen: 'CatalogPlant',
					params: { item: response.data.data },
					initial: false,
				});
			})
			.catch((error) => {
				console.log('ERROR', error.response);
			});
	};

	const getDisease = () => {
		nodeApi
			.get(`/plant-protection/disease/${stateData.disease_id}`)
			.then((response) => {
				console.log('RESP', JSON.stringify(response, null, 2));
				props.navigation.navigate('Catalog', {
					screen: 'CatalogDisease',
					params: { item: response.data.data },
					initial: false,
				});
			})
			.catch((error) => {
				console.log('ERROR', error.response);
			});
	};

	const ShowPlant = () => {
		if (stateData.plant_id) {
			return (
				<View style={styles.plantInfo}>
					<Text style={{ fontSize: 18, fontWeight: 'bold' }}>Растение</Text>
					<TouchableOpacity
						style={{ flexDirection: 'row', paddingVertical: 10 }}
						onPress={() => {
							getPlant();
						}}
					>
						<Text style={{ fontSize: 18, textAlignVertical: 'center' }}>
							{stateData.plant_name}
						</Text>
						<FontAwesome
							name="chevron-right"
							size={20}
							color="#379683"
							style={{ flex: 1, paddingLeft: 10, alignSelf: 'center' }}
						/>
					</TouchableOpacity>
				</View>
			);
		}
		return (
			<View style={styles.plantInfo}>
				<Text style={{ fontSize: 18, fontWeight: 'bold' }}>Растение</Text>
				<Text style={{ paddingVertical: 10, fontSize: 18 }}>Растение не обнаружено</Text>
			</View>
		);
	};

	const ShowDisease = () => {
		if (stateData.disease_id) {
			return (
				<View style={styles.diseaseInfo}>
					<Text style={{ fontSize: 18, fontWeight: 'bold' }}>Заболевание</Text>
					<TouchableOpacity
						style={{ flexDirection: 'row', paddingVertical: 10 }}
						onPress={() => {
							getDisease();
						}}
					>
						<Text style={{ fontSize: 18, fontWeight: 'bold' }}>
							{stateData.disease_name}
						</Text>
						<FontAwesome
							name="chevron-right"
							size={20}
							color="#379683"
							style={{ flex: 1, paddingLeft: 10 }}
						/>
					</TouchableOpacity>
				</View>
			);
		}
		return (
			<View style={styles.diseaseInfo}>
				<Text style={{ fontSize: 18, fontWeight: 'bold' }}>Заболевание</Text>
				<Text style={{ paddingVertical: 10, fontSize: 18 }}>Заболевание не обнаружены</Text>
			</View>
		);
	};

	console.log('STATE', stateData);

	if (stateData) {
		const imageUrlReady = stateData.compressed_url
			.replace('/var/leafs_files/upload/', 'https://leafs-app.lab-code.com/upload/')
			.replace('/usr/src/leafs_files/upload/', 'https://leafs-app.lab-code.com/upload/');

		return (
			<ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
				<Image
					source={{ uri: imageUrlReady }}
					style={{
						resizeMode: 'contain',
						flex: 1,
						height: 400,
					}}
				/>
				<ShowPlant />
				<ShowDisease />
			</ScrollView>
		);
	}
	return null;
};

const window = Dimensions.get('screen').height / 2;
console.log(window);

const styles = StyleSheet.create({
	image: {
		resizeMode: 'contain',
		flex: 1,
		height: window,
	},
	cardStyle: {
		flex: 1,
		backgroundColor: 'white',
	},
	plantInfo: {
		marginHorizontal: 10,
	},
	diseaseInfo: {
		marginHorizontal: 10,
	},
});

export default LastScanFullscreenPhotoScreen;
