import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ScrollView, TouchableOpacity, View } from 'react-native';
import HTML from 'react-native-render-html';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import nodeApi from '../api/nodeApi';

const CatalogPlantScreen = (props) => {
	const { route } = props;
	const itemContent = route.params.item.content;
	const itemId = route.params.item.id;

	const [disease, setDisease] = useState(null);
	const [showDisease, setShowDisease] = useState(false);

	useEffect(() => {
		getPlantDiseaseInfo();
		props.navigation.setOptions({
			headerTitle: route.params.item.name,
			headerTruncatedBackTitle: 'Назад',
		});
	}, []);

	const getPlantDiseaseInfo = () => {
		nodeApi
			.get(`/plant-protection/link/plant/${itemId}/disease`)
			.then((response) => {
				console.log('RESP', response.data.data);
				const dis = response.data.data;
				let i;
				for (i = 0; i < dis.length; i += 1) {
					dis[i].content = dis[i].disease_content;
					dis[i].name = dis[i].disease_name;
					dis[i].id = dis[i].disease_id;
					delete dis[i].disease_content;
					delete dis[i].disease_name;
					delete dis[i].disease_id;
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
						<Text style={{ fontSize: 18, fontWeight: 'bold' }}>
							Распространенные вредители:
						</Text>
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
			console.log(item.disease_name);
			const diseaseName = item.name;
			return (
				<TouchableOpacity
					onPress={() => props.navigation.navigate('CatalogDisease', { item })}
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
					<Text style={{ fontSize: 16, flex: 1, paddingLeft: 10 }}>{diseaseName}</Text>
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
		backgroundColor: 'white',
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
