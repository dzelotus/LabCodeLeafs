import React, { useState, useEffect } from 'react';
import {
	View,
	StyleSheet,
	Text,
	FlatList,
	TouchableOpacity,
	ActivityIndicator,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { SearchBar } from 'react-native-elements';
import nodeApi from '../api/nodeApi';

const CatalogScreen = (props) => {
	const [loading, setLoading] = useState(true);
	const [fetchedData, setFetchedData] = useState(null);
	const [activeButton, setActiveButton] = useState('plant');
	const [navScreen, setNavScreen] = useState('CatalogPlant');
	const [searchingField, setSearchingField] = useState('');
	const [displayedData, setDisplayedData] = useState(null);
	const [listType, setListType] = useState('plant');

	useEffect(() => {
		fetchCatalog({ item: listType });
	}, []);

	const fetchCatalog = (item) => {
		setLoading(true);
		nodeApi
			.get(`/plant-protection/${item.item}`)
			.then((response) => {
				console.log('RESP', JSON.stringify(response, null, 2));
				setFetchedData(response.data.data);
				setDisplayedData(response.data.data);
				setLoading(false);
			})
			.catch((error) => {
				console.log('ERROR', error.response);
				setLoading(false);
			});
	};

	const handlePressChangingList = (lType) => {
		setActiveButton(lType);
		setListType(lType);
		fetchCatalog({ item: lType });
		setNavScreen(`Catalog${lType[0].toUpperCase()}${lType.slice(1, lType.length)}`);
		setListType(lType);
		setSearchingField('');
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
						handlePressChangingList('plant');
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
						handlePressChangingList('disease');
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
						handlePressChangingList('heal');
					}}
				>
					<Text style={activeButton === 'heal' ? styles.activeButton : styles.itemButton}>
						Лечение
					</Text>
				</TouchableOpacity>
			</View>
		);
	};
	const SearchUpdate = (value) => {
		setDisplayedData(
			fetchedData.filter(
				(item) =>
					item.name !== undefined &&
					item.name.toLowerCase().search(value.toLowerCase()) >= 0,
			),
		);
	};

	const HandleChangeSearchField = (value) => {
		setSearchingField(value);
		SearchUpdate(value);
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
			<MainButtons />
			<SearchBar
				placeholder="Поиск по каталогу"
				onChangeText={(value) => HandleChangeSearchField(value)}
				value={searchingField}
				lightTheme
				containerStyle={{ backgroundColor: '#fff' }}
				inputContainerStyle={{
					backgroundColor: '#fff',
					borderBottomWidth: 2,
					borderBottomColor: '#cfcfcf',
				}}
			/>
			<View style={{ paddingBottom: 60 }}>
				<FlatList
					data={displayedData}
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
