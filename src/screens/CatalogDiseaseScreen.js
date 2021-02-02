import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import HTML from 'react-native-render-html';
import nodeApi from '../api/nodeApi';

const CatalogPlantScreen = (props) => {
	const { route } = props;
	console.log('route', route); // nav from plant get disease_content, nav from catalog get content
	const itemContent = route.params.item.content;
	const itemId = route.params.item.id;

	const [disease, setDisease] = useState([]);

	useEffect(() => {
		getDiseaseHealInfo();
		props.navigation.setOptions({
			headerTitle: route.params.item.name,
		});
	}, []);

	const getDiseaseHealInfo = () => {
		nodeApi
			.get(`/plant-protection/link/disease/${itemId}/heal`)
			.then((response) => {
				console.log('RESP', response.data.data);
				setDisease(response.data.data);
			})
			.catch((error) => console.log('ERR', error.response));
	};

	const RenderDisease = () => {
		return disease.map((item) => {
			console.log(item.heal_name);
			const healName = item.heal_name;
			return (
				<TouchableOpacity
					onPress={() => props.navigation.navigate('CatalogHeal', { item })}
					key={item.id}
				>
					<Text>{healName}</Text>
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
