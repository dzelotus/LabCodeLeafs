import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import HTML from 'react-native-render-html';
import nodeApi from '../api/nodeApi';

const CatalogPlantScreen = (props) => {
	const { route } = props;
	const itemContent = route.params.item.content;
	const itemId = route.params.item.id;

	const [disease, setDisease] = useState([]);

	useEffect(() => {
		getPlantDiseaseInfo();
		props.navigation.setOptions({
			headerTitle: route.params.item.name,
		});
	}, []);

	const getPlantDiseaseInfo = () => {
		nodeApi
			.get(`/plant-protection/link/plant/${itemId}/disease`)
			.then((response) => {
				console.log('RESP', response.data.data);
				setDisease(response.data.data);
			})
			.catch((error) => console.log('ERR', error.response));
	};

	const RenderDisease = () => {
		return disease.map((item) => {
			console.log(item.disease_name);
			const diseaseName = item.disease_name;
			return (
				<TouchableOpacity
					onPress={() => props.navigation.navigate('CatalogDisease', { item })}
					key={item.id}
				>
					<Text>{diseaseName}</Text>
				</TouchableOpacity>
			);
		});
	};

	return (
		<ScrollView style={styles.container}>
			<HTML source={{ html: itemContent }} />
			<Text>Распространенные вредители:</Text>
			<RenderDisease />
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16,
		marginTop: 5,
		backgroundColor: '#f4f4f4',
	},
});

export default CatalogPlantScreen;
