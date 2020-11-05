/* eslint-disable consistent-return */
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import nodeApi from '../api/nodeApi';

const GardenScreen = () => {
	const [csrf, setCsrf] = useState();
	const [check, setCheck] = useState(false);
	const [garden, setGarden] = useState({});
	const [newGarden, setNewGarden] = useState({
		name: '',
		description: '',
	});

	const getCsrf = () => {
		nodeApi
			.get('/garden/new')
			.then((response) => {
				console.log('GARDEN RESPONSE', response.data.csrfToken);
				setCsrf(response.data.csrfToken);
			})
			.catch((error) => console.log('GARDEN ERROR', error));
	};

	const getGardens = () => {
		nodeApi
			.get('/garden')
			.then((response) => {
				console.log('GET GARDENS', response.data.data[0]);
				setGarden(response.data.data);
			})
			.catch((error) => console.log(error));
	};

	useEffect(() => {
		getCsrf();
		getGardens();
	}, []);
	console.log(newGarden);
	console.log(garden);

	const addText = () => {
		if (check) {
			return (
				<View style={styles.addContainerStyle}>
					<Input
						label="Название Огорода"
						onChangeText={(text) => {
							setNewGarden({ ...newGarden, name: text });
						}}
					/>
					<Input
						label="Описание"
						onChangeText={(text) => {
							setNewGarden({ ...newGarden, description: text });
						}}
					/>
					<Button
						title="Создать огород"
						onPress={() => {
							createGarden();
						}}
					/>
				</View>
			);
		}
	};

	const createGarden = () => {
		nodeApi
			.post('/garden', {
				name: newGarden.name,
				description: newGarden.description,
				_csrf: csrf,
			})
			.then((response) => {
				console.log('GARDEN CREATE', response);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const MenuIcon = () => {
		if (check) {
			return <Icon name="menu-up" size={30} />;
		}
		return <Icon name="menu-down" size={30} />;
	};

	return (
		<View>
			<View>
				<FlatList
					data={garden}
					renderItem={({ item }) => {
						console.log('ITEM', item);
						return (
							<View>
								<Text>{item.name}</Text>
								<Text>{item.description}</Text>
							</View>
						);
					}}
				/>
			</View>
			<TouchableOpacity
				style={check ? styles.scanBtnPressed : styles.scanBtnNormal}
				onPress={() => {
					setCheck(!check);
				}}
			>
				<View style={styles.rowDirection}>
					<Text style={{ fontSize: 18, marginLeft: 10, color: '#FF9800' }}>
						Создать огород
					</Text>
					<MenuIcon />
				</View>
			</TouchableOpacity>
			{addText()}
		</View>
	);
};

const styles = StyleSheet.create({
	scanBtnNormal: {
		marginHorizontal: 15,
		marginVertical: 10,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 12,
		},
		shadowOpacity: 0.58,
		shadowRadius: 16.0,

		elevation: 3,
		borderRadius: 10,
		borderColor: '#000',
		backgroundColor: '#fff',
		alignItems: 'center',
		height: 40,
		justifyContent: 'center',
	},
	scanBtnPressed: {
		marginHorizontal: 15,
		marginTop: 10,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 12,
		},
		shadowOpacity: 0.58,
		shadowRadius: 16.0,

		elevation: 3,
		borderRadius: 10,
		borderColor: '#000',
		backgroundColor: '#fff',
		alignItems: 'center',
		height: 40,
		justifyContent: 'center',
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
	},
	addContainerStyle: {
		marginHorizontal: 15,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 12,
		},
		shadowOpacity: 0.58,
		shadowRadius: 16.0,
		elevation: 3,
		borderRadius: 10,
		borderColor: '#000',
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		borderTopLeftRadius: 0,
		borderTopRightRadius: 0,
		marginBottom: 10,
		paddingBottom: 10,
	},
	rowDirection: {
		flexDirection: 'row',
	},
});

export default GardenScreen;
