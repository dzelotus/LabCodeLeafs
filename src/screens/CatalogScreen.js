import React, { useState, useEffect } from 'react';
import {
	View,
	StyleSheet,
	Text,
	FlatList,
	TouchableOpacity,
	ActivityIndicator,
	Button,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { SearchBar } from 'react-native-elements';
import SQLite from 'react-native-sqlite-storage';
import nodeApi from '../api/nodeApi';

import { db } from '../database/database';

const CatalogScreen = (props) => {
	const [fetchedData, setFetchedData] = useState(null);
	const [localData, setLocalData] = useState(null);
	const [activeButton, setActiveButton] = useState('plant');
	const [navScreen, setNavScreen] = useState('CatalogPlant');
	const [searchingField, setSearchingField] = useState('');
	const [displayedData, setDisplayedData] = useState(null);
	const [listType, setListType] = useState('plant');

	useEffect(() => {
		fetchCatalog({ item: listType });
		SQLite.enablePromise(true);
		SQLite.DEBUG(true);
	}, []);

	const fetchCatalog = (item) => {
		/* nodeApi
			.get(`/plant-protection/${item.item}`)
			.then((response) => {
				setFetchedData(response.data.data);
				setDisplayedData(response.data.data);
			})
			.catch((error) => {
				console.log('ERROR', error.response);
			}); */

		db.transaction((txn) => {
			txn.executeSql(
				`SELECT ai_name, content, id, name FROM ${item.item} ORDER BY name`,
				[],
				(tx, results) => {
					console.log('SUCCESS FUCKING SUCCESS');
					const res = results.rows;
					const resArr = [];
					for (let i = 0; i < res.length; i += 1) {
						resArr.push(res.item(i));
					}
					console.log('RESULTS', results);
					console.log('LOCAL DATA', resArr[0]);

					setFetchedData(resArr);
					setDisplayedData(resArr);
				},
				() => {
					console.log('ERROR BASE ERROR FUCKING ERROR');
					/* createTable(); */
				},
			);
		});
		/* .then((res) => console.log('SUCCESS', res))
			.catch((err) => {
				console.log('ERROR', err);
				
				// insertRows();
			}); */
	};

	/* 	const createTable = () => {
		db.transaction((txn) => {
			txn.executeSql(
				'CREATE TABLE IF NOT EXISTS plant (id bigint NOT NULL, name character varying(255) NOT NULL, content jsonb NOT NULL, ai_name character varying)',
				[],
				(tx, results) => {
					console.log('SUCCESS', results);
				},
				(error) => {
					console.log('BIG FUCKING ERROR', error);
				},
			);
		});
	}; */

	const dropTable = () => {
		db.transaction((txn) => {
			txn.executeSql(
				'DROP TABLE IF EXISTS plant',
				[],
				(tx, results) => {
					console.log('TABLE DELETED', results);
				},
				(error) => {
					console.log('BIG FUCKING ERROR', error);
				},
			);
		});
	};

	const insertRows = () => {
		/* fetchedData.forEach((element) => {
			console.log('ITEM', Object.values(element));
		}); */
		fetchedData.map((item) => {
			const { name, content, id } = item;
			const aiName = item.ai_name;
			console.log('CONTENT', content);
			db.transaction((txn) => {
				txn.executeSql(
					`INSERT INTO plant (id, name, content, ai_name) VALUES (${id}, '${name}', '${content}', '${aiName}')`,
					[],
					(tx, results) => {
						console.log('SUCCESS', results);
					},
					(error) => {
						console.log('BIG FUCKING ERROR', error);
					},
				);
			});
			return item;
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

	if (!displayedData) {
		return (
			<View style={{ flex: 1, backgroundColor: 'white' }}>
				<MainButtons />
				<ActivityIndicator size="large" color="#379683" style={{ flex: 1 }} />
			</View>
		);
	}
	return (
		<View style={{ flex: 1, backgroundColor: 'white' }}>
			<Button title="delete table" onPress={() => dropTable()} />
			<Button title="insert rows" onPress={() => insertRows()} />
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
			<View style={{ flex: 1, paddingBottom: 10 }}>
				<FlatList
					data={displayedData}
					keyExtractor={(item) => item.name}
					style={{ flex: 1 }}
					renderItem={({ item }) => {
						return (
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
						);
					}}
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
