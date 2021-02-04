import React, { useState, useEffect } from 'react';
import {
	View,
	StyleSheet,
	Text,
	FlatList,
	TouchableOpacity,
	/* TextInput, */
	ActivityIndicator,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import nodeApi from '../api/nodeApi';

const CatalogScreen = (props) => {
	const [loading, setLoading] = useState(true);
	const [fetchedData, setFetchedData] = useState(null);
	const [activeButton, setActiveButton] = useState('plant');
	const [navScreen, setNavScreen] = useState('CatalogPlant');

	useEffect(() => {
		fetchCatalog({ item: 'plant' });
	}, []);

	const fetchCatalog = (item) => {
		setLoading(true);
		nodeApi
			.get(`/plant-protection/${item.item}`)
			.then((response) => {
				console.log('RESP', JSON.stringify(response, null, 2));
				setFetchedData(response.data.data);
				setLoading(false);
			})
			.catch((error) => {
				console.log('ERROR', error.response);
				setLoading(false);
			});
	};

	const MainButtons = () => {
		return (
			<View style={styles.mainButtons}>
				<TouchableOpacity
					style={{
						flex: 1,
						alignContent: 'center',
						alignItems: 'center',
						justifyContent: 'center',
					}}
					onPress={() => {
						setActiveButton('plant');
						fetchCatalog({ item: 'plant' });
						setNavScreen('CatalogPlant');
					}}
				>
					<Text
						style={activeButton === 'plant' ? styles.activeButton : styles.itemButton}
					>
						Растения
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={{ flex: 1 }}
					onPress={() => {
						setActiveButton('disease');
						fetchCatalog({ item: 'disease' });
						setNavScreen('CatalogDisease');
					}}
				>
					<Text
						style={activeButton === 'disease' ? styles.activeButton : styles.itemButton}
					>
						Болезни
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={{ flex: 1 }}
					onPress={() => {
						setActiveButton('heal');
						fetchCatalog({ item: 'heal' });
						setNavScreen('CatalogHeal');
					}}
				>
					<Text style={activeButton === 'heal' ? styles.activeButton : styles.itemButton}>
						Лечение
					</Text>
				</TouchableOpacity>
			</View>
		);
	};

	console.log(activeButton);

	if (loading) {
		return (
			<View style={{ flex: 1 }}>
				<MainButtons />
				<ActivityIndicator size="large" color="#379683" style={{ flex: 1 }} />
			</View>
		);
	}
	return (
		<View style={{ flex: 1, backgroundColor: 'white' }}>
			{/* <View style={styles.inputContainer}>
				<TextInput
					autoCapitalize="none"
					placeholder="Поиск по каталогу"
					style={styles.inputStyle}
					value={term}
					onChangeText={(newTerm) => setTerm(newTerm)}
					onEndEditing={() => console.log('submitted')}
				/>
			</View> */}
			<MainButtons />
			<View style={{ paddingBottom: 60 }}>
				<FlatList
					data={fetchedData}
					keyExtractor={(item) => item.name}
					renderItem={({ item }) => (
						<TouchableOpacity
							onPress={() => props.navigation.navigate(navScreen, { item })}
							style={{
								flex: 1,
								flexDirection: 'row',
								justifyContent: 'space-between',
								borderBottomColor: 'gray',
								borderBottomWidth: 1,
								marginHorizontal: 10,
							}}
						>
							{/* <Image
								style={styles.imageStyle}
								source={{
									uri: 'https://2ch.hk/test/src/22583/14918417781080.png',
								}}
							/> */}
							<View
								style={{
									flex: 1,
									marginVertical: 20,
								}}
							>
								<Text style={styles.nameStyle}>{item.name}</Text>
							</View>
							<View
								style={{
									alignItems: 'flex-end',
									justifyContent: 'center',
								}}
							>
								<FontAwesome name="chevron-right" size={20} color="#379683" />
							</View>
						</TouchableOpacity>
					)}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	inputStyle: {
		color: '#000',
		paddingRight: 5,
		paddingLeft: 5,
		fontSize: 16,
		lineHeight: 23,
	},
	inputContainer: {
		borderBottomColor: '#7FC844',
		borderBottomWidth: 1,
		marginVertical: 5,
		marginLeft: 10,
		marginRight: 10,
	},
	imageStyle: {
		height: 80,
		width: 80,
		borderRadius: 40,
		borderWidth: 1,
		borderColor: 'gray',
		overflow: 'hidden',
	},
	nameStyle: {
		fontSize: 20,
	},
	alternativeNameStyle: { color: 'green' },
	mainButtons: {
		marginHorizontal: 10,
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
		height: 40,
		justifyContent: 'center',
		alignContent: 'center',

		flexDirection: 'row',
	},
	itemButton: {
		textAlign: 'center',
		color: 'black',
	},
	activeButton: {
		color: '#EB9156',
		textAlign: 'center',
		textDecorationLine: 'underline',
	},
});

export default CatalogScreen;
