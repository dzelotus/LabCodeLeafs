import React, { useEffect, useState } from 'react';
import {
	Image,
	View,
	StyleSheet,
	Text,
	Alert,
	TouchableOpacity,
	ScrollView,
	ActivityIndicator,
} from 'react-native';
import HTML from 'react-native-render-html';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import nodeApi from '../api/nodeApi';

const LastScanFullscreenPhotoScreen = (props) => {
	const [stateData, setStateData] = useState(null);
	const [loading, setLoading] = useState(null);
	const [plant, setPlant] = useState(null);
	const [disease, setDisease] = useState(null);
	const [showPlant, setShowPlant] = useState(false);
	const [showDisease, setShowDisease] = useState(false);
	const { route } = props;
	console.log('FULL SCREEN', props);

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
	}, []);

	const getPlant = () => {
		if (!plant) {
			setLoading(true);
			nodeApi
				.get(`/plant-protection/plant/${stateData.plant_id}`)
				.then((response) => {
					console.log('RESP', JSON.stringify(response, null, 2));
					setPlant(response.data.data);
					setLoading(false);
				})
				.catch((error) => {
					console.log('ERROR', error.response);
					setLoading(false);
				});
		}
		return null;
	};

	const getDisease = () => {
		if (!disease) {
			setLoading(true);
			nodeApi
				.get(`/plant-protection/disease/${stateData.disease_id}`)
				.then((response) => {
					console.log('RESP', JSON.stringify(response, null, 2));
					setDisease(response.data.data);
					setLoading(false);
				})
				.catch((error) => {
					console.log('ERROR', error.response);
					setLoading(false);
				});
		}
		return null;
	};

	const ShowPlant = () => {
		if (stateData.plant_id) {
			return (
				<View style={styles.additionalInfo}>
					<TouchableOpacity
						style={{ flexDirection: 'row', paddingVertical: 10 }}
						onPress={() => {
							getPlant();
							setShowPlant(!showPlant);
						}}
					>
						<Text style={{ fontSize: 18, fontWeight: 'bold' }}>
							{stateData.plant_name}
						</Text>
						<FontAwesome
							name={showPlant ? 'chevron-up' : 'chevron-down'}
							size={20}
							color="#379683"
							style={{ flex: 1, paddingLeft: 10 }}
						/>
					</TouchableOpacity>
					{showPlant ? plantData() : null}
				</View>
			);
		}
		return (
			<View>
				<Text>Растение не обнаружено</Text>
			</View>
		);
	};

	const plantData = () => {
		if (!loading) {
			return (
				<View>
					<HTML source={{ html: plant.content }} />
				</View>
			);
		}
		return (
			<View style={{ flex: 1 }}>
				<ActivityIndicator size="large" color="#379683" style={{ flex: 1 }} />
			</View>
		);
	};

	const diseaseData = () => {
		if (disease) {
			return (
				<View>
					<HTML source={{ html: disease.content }} />
				</View>
			);
		}
		return (
			<View style={{ flex: 1 }}>
				<ActivityIndicator size="large" color="#379683" style={{ flex: 1 }} />
			</View>
		);
	};

	const ShowDisease = () => {
		if (stateData.disease_id) {
			return (
				<View style={styles.additionalInfo}>
					<TouchableOpacity
						style={{ flexDirection: 'row', paddingVertical: 10 }}
						onPress={() => {
							getDisease();
							setShowDisease(!showDisease);
						}}
					>
						<Text style={{ fontSize: 18, fontWeight: 'bold' }}>
							{stateData.disease_name}
						</Text>
						<FontAwesome
							name={showDisease ? 'chevron-up' : 'chevron-down'}
							size={20}
							color="#379683"
							style={{ flex: 1, paddingLeft: 10 }}
						/>
					</TouchableOpacity>
					{showDisease ? diseaseData() : null}
				</View>
			);
		}
		return (
			<View>
				<Text>Болезни не обнаружены</Text>
			</View>
		);
	};

	console.log('STATE', stateData);

	if (stateData) {
		const imageUrlReady = stateData.compressed_url
			.replace('/var/leafs_files/upload/', 'https://leafs-app.lab-code.com/upload/')
			.replace('/usr/src/leafs_files/upload/', 'https://leafs-app.lab-code.com/upload/');

		return (
			<ScrollView style={{ flex: 1 }}>
				<Image
					source={{ uri: imageUrlReady }}
					style={{
						resizeMode: 'contain',
						width: 200,
						height: 200,
					}}
				/>
				<ShowPlant />
				<ShowDisease />
			</ScrollView>
		);
	}
	return null;
};

const styles = StyleSheet.create({});

export default LastScanFullscreenPhotoScreen;
