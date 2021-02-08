import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ScrollView, TouchableOpacity, View } from 'react-native';
import HTML from 'react-native-render-html';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import nodeApi from '../api/nodeApi';

const CatalogPlantScreen = (props) => {
	const { route } = props;
	// nav from plant get disease_content, nav from catalog get content
	console.log('ROUTE', route);
	const itemContent = route.params.item.content;

	const itemId = route.params.item.id;

	const [disease, setDisease] = useState([]);
	const [showDisease, setShowDisease] = useState(false);

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
				console.log(response);
				const dis = response.data.data;
				let i;
				for (i = 0; i < dis.length; i += 1) {
					dis[i].content = dis[i].heal_content;
					dis[i].name = dis[i].heal_name;
					delete dis[i].heal_content;
					delete dis[i].heal_name;
				}
				console.log('dis', dis);
				setDisease(dis);
			})
			.catch((error) => console.log('ERR', error.response));
	};

	const RenderDiseaseList = () => {
		if (disease) {
			return (
				<View style={styles.additionalInfo}>
					<TouchableOpacity
						style={{ flexDirection: 'row', paddingVertical: 10 }}
						onPress={() => setShowDisease(!showDisease)}
					>
						<Text style={{ fontSize: 18, fontWeight: 'bold' }}>Методы борьбы</Text>
						<FontAwesome
							name={showDisease ? 'chevron-up' : 'chevron-down'}
							size={20}
							color="#379683"
							style={{ flex: 1, paddingLeft: 10 }}
						/>
					</TouchableOpacity>
					{showDisease ? getDiseaseItem() : null}
				</View>
			);
		}
		return null;
	};

	const getDiseaseItem = () => {
		return disease.map((item) => {
			console.log(item.name);
			const healName = item.name;
			return (
				<TouchableOpacity
					onPress={() => props.navigation.navigate('CatalogHeal', { item })}
					key={item.id}
					style={{
						flexDirection: 'row',
						paddingVertical: 10,
						borderBottomWidth: 1,
						borderBottomColor: 'gray',
						marginHorizontal: 10,
						justifyContent: 'space-between',
						alignContent: 'space-between',
						flex: 1,
					}}
				>
					<Text style={{ fontSize: 16, flex: 1, paddingLeft: 10 }}>{healName}</Text>
					<FontAwesome
						name="chevron-right"
						size={20}
						color="#379683"
						style={{ paddingRight: 10 }}
					/>
				</TouchableOpacity>
			);
		});
	};

	return (
		<ScrollView style={styles.container}>
			<HTML source={{ html: itemContent }} />
			<RenderDiseaseList />
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
	additionalInfo: {
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
		padding: 5,
		marginBottom: 10,
	},
});

export default CatalogPlantScreen;
