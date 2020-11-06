/* eslint-disable operator-linebreak */
/* eslint-disable consistent-return */
import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	FlatList,
	ActivityIndicator,
} from 'react-native';
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
	const [loading, setLoading] = useState({
		screenLoading: true,
		buttonLoading: false,
	});
	const [gardenOpen, setGardenOpen] = useState({});

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
		setLoading({ screenLoading: true });
		nodeApi
			.get('/garden')
			.then((response) => {
				console.log('GET GARDENS', response.data.data[0]);
				setGarden(response.data.data);
				setLoading({ screenLoading: false });
			})
			.catch((error) => console.log(error));
	};

	useEffect(() => {
		getCsrf();
		getGardens();
	}, []);

	const addGarden = () => {
		if (check) {
			return (
				<View style={styles.addContainerStyle}>
					<View style={styles.addGardenCard}>
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
						<LoadingButton />
						<View style={{ position: 'absolute', bottom: 0, right: 0 }}>
							<TouchableOpacity
								style={styles.addGardenBtnPressed}
								onPress={() => {
									setCheck(false);
								}}
							>
								<Icon name="close" size={30} color="#8DC34A" />
							</TouchableOpacity>
						</View>
					</View>
				</View>
			);
		}
		return (
			<View
				style={{
					position: 'absolute',
					bottom: 15,
					right: 15,
				}}
			>
				<TouchableOpacity
					style={styles.addGardenBtnNormal}
					onPress={() => {
						setCheck(true);
					}}
				>
					<Icon
						name="close"
						size={25}
						color="#8DC34A"
						style={{ transform: [{ rotate: '45deg' }] }}
					/>
				</TouchableOpacity>
			</View>
		);
	};

	const createGarden = () => {
		setLoading({ buttonLoading: true });
		nodeApi
			.post('/garden', {
				name: newGarden.name,
				description: newGarden.description,
				_csrf: csrf,
			})
			.then((response) => {
				console.log('GARDEN CREATE', response);
				setLoading({ buttonLoading: false });
				setCheck(false);
				getGardens();
			})
			.catch((error) => {
				console.log(error.response);
				setLoading({ buttonLoading: false });
			});
	};

	const Indicator = () => (
		<View>
			<ActivityIndicator size="large" color="#8DC34A" />
		</View>
	);

	const LoadingButton = () => {
		if (loading.buttonLoading === true) {
			return <Indicator />;
		}
		return (
			<Button
				title="Создать огород"
				onPress={() => {
					createGarden();
				}}
			/>
		);
	};

	const openedGarden = (open) => {
		if (gardenOpen[open]) {
			return <Text>Открыто</Text>;
		}
	};

	console.log('PRESS', gardenOpen);

	if (loading.screenLoading === true) {
		return <Indicator />;
	}
	return (
		<View style={{ flex: 1 }}>
			<View>
				<FlatList
					data={garden}
					renderItem={({ item }) => {
						console.log('ITEM', item);
						return (
							<View>
								<View
									style={
										gardenOpen[item.id]
											? styles.gardenContainerPressed
											: styles.gardenContainerNormal
									}
								>
									<TouchableOpacity
										style={{
											flexDirection: 'row',
											flex: 1,
											justifyContent: 'space-between',
										}}
										onPress={(index) => {
											index = item.id;
											if (gardenOpen[index] === true) {
												setGardenOpen({
													...gardenOpen,
													[index]: false,
												});
											} else {
												setGardenOpen({
													...gardenOpen,
													[index]: true,
												});
											}
										}}
									>
										<Text>{item.name}</Text>
										<Text>{item.description}</Text>
										<Icon name="chevron-down" size={20} />
									</TouchableOpacity>
								</View>
								<View style={styles.gardenContainerOpened}>
									{openedGarden(item.id)}
								</View>
							</View>
						);
					}}
				/>
			</View>
			{addGarden()}
		</View>
	);
};

const styles = StyleSheet.create({
	addGardenBtnNormal: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 12,
		},
		shadowOpacity: 0.58,
		shadowRadius: 16.0,
		elevation: 3,
		borderRadius: 50,
		backgroundColor: '#fff',
		alignItems: 'center',
		width: 60,
		height: 60,
		justifyContent: 'center',
		borderColor: '#8DC34A',
		borderWidth: 1,
	},
	addGardenBtnPressed: {
		borderRadius: 50,
		backgroundColor: '#fff',
		alignItems: 'center',
		width: 60,
		height: 60,
		justifyContent: 'center',
	},

	addContainerStyle: {
		position: 'absolute',
		bottom: 0,
		width: '100%',
		alignSelf: 'center',
		alignContent: 'center',
	},
	addGardenCard: {
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
		margin: 15,
		padding: 10,
	},

	gardenContainerNormal: {
		marginHorizontal: 15,
		marginTop: 15,
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
		flexDirection: 'row',
		justifyContent: 'space-between',
		flex: 1,
	},
	gardenContainerPressed: {
		marginHorizontal: 15,
		marginTop: 15,
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
		flexDirection: 'row',
		justifyContent: 'space-between',
		flex: 1,
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
	},
	gardenContainerOpened: {
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
		flexDirection: 'row',
		justifyContent: 'space-between',
		flex: 1,
		borderTopLeftRadius: 0,
		borderTopRightRadius: 0,
	},
});

export default GardenScreen;
