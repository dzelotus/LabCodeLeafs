/* eslint-disable no-else-return */
/* eslint-disable operator-linebreak */
/* eslint-disable consistent-return */
import React, { useEffect } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	FlatList,
	ActivityIndicator,
	Alert,
} from 'react-native';
import { Input, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import nodeApi from '../api/nodeApi';

import {
	inputChange,
	getCsrf,
	getGardens,
	openGarden,
	addButtonSwitch,
	createGarden,
	deleteGarden,
	changeButtonAction,
	editGarden,
	updateGarden,
	getPlantsData,
	clearState,
} from '../actions/GardenActions';

const GardenScreen = (props) => {
	const {
		navigation,
		gardenId,
		gardenName,
		gardenDescription,
		inputChange,
		csrf,
		getGardens,
		gardenData,
		addBtnSwitch,
		addButtonSwitch,
		createGarden,
		deleteGarden,
		buttonLoading,
		screenLoading,
		openGarden,
		itemOpenIndex,
		changeButtonAction,
		editButton,
		editGarden,
		updateGarden,
		getPlantsData,
		plantsData,
		route,
		clearState,
		plantsLoading,
	} = props;

	console.log('PROPS', screenLoading);

	useEffect(() => {
		getGardens();
		console.log('FOCUS');
		const unsubscribe = navigation.addListener('focus', () => {
			route.params ? getPlantsData({ index: props.route.params.onBack }) : console.log('NO');
		});
		return unsubscribe;
	}, [navigation, route.params]);

	const addGarden = () => {
		if (addBtnSwitch) {
			return (
				<View style={styles.addContainerStyle}>
					<View style={styles.addGardenCard}>
						<Input
							label="Название Огорода"
							onChangeText={(text) => {
								inputChange({
									prop: 'gardenName',
									value: text,
								});
							}}
							value={gardenName}
						/>
						<Input
							label="Описание"
							onChangeText={(text) => {
								inputChange({
									prop: 'gardenDescription',
									value: text,
								});
							}}
							value={gardenDescription}
						/>
						{loadingButton()}
						<View style={{ position: 'absolute', bottom: 0, right: 0 }}>
							<TouchableOpacity
								style={styles.addGardenBtnPressed}
								onPress={() => {
									addButtonSwitch(!addBtnSwitch);
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
						changeButtonAction(false);
						clearState();
						addButtonSwitch(!addBtnSwitch);
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

	const Indicator = () => (
		<View>
			<ActivityIndicator size="large" color="#8DC34A" />
		</View>
	);

	const loadingButton = () => {
		if (buttonLoading === true) {
			return <Indicator />;
		}
		return (
			<Button
				title={editButton ? 'Редактировать Огород' : 'Создать Огород'}
				onPress={() => {
					if (!editButton) {
						createGarden(gardenName, gardenDescription, csrf);
					} else {
						console.log('UPDATE TAP');
						updateGarden(gardenId, gardenName, gardenDescription, csrf);
					}
				}}
			/>
		);
	};

	const deleteAlert = (gardenId) => {
		Alert.alert(
			'Предупреждение',
			'Вы точно хотите удалить огород? Отмена удаления невозможна!',
			[
				{
					text: 'Отменить',
				},
				{
					text: 'Удалить',
					onPress: () => {
						deleteGarden(gardenId);
					},
				},
			],
		);
	};

	const deletePlant = (plantId, gardenId) => {
		console.log(plantId, gardenId);
		Alert.alert('Предупреждение', 'Вы точно хотите удалить растение?', [
			{ text: 'Отменить' },
			{
				text: 'Удалить',
				onPress: () => {
					nodeApi
						.delete(`/garden-planting/${gardenId}/planting/${plantId}`)
						.then((response) => {
							console.log('DEL RESP', response);
							getPlantsData({ index: gardenId });
						})
						.catch((error) => console.log(error.response));
				},
			},
		]);
	};

	const openedGarden = (gardenId) => {
		if (itemOpenIndex[gardenId] === true) {
			return (
				<View style={{ flex: 1 }}>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'flex-end',
						}}
					>
						<TouchableOpacity
							onPress={() => {
								deleteAlert(gardenId);
							}}
						>
							<Icon name="delete-outline" size={30} color="red" />
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								changeButtonAction(true);
								addButtonSwitch(!addBtnSwitch);
								addGarden();
								editGarden(gardenId);
							}}
						>
							<Icon name="pencil-outline" size={30} color="orange" />
						</TouchableOpacity>
					</View>
					<View>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								flex: 1,
							}}
						>
							<Text style={{ flex: 1, textAlignVertical: 'center' }}>Растение</Text>
							<Text style={{ flex: 1, textAlignVertical: 'center' }}>
								Дата посадки
							</Text>
							<Text style={{ flex: 1, textAlignVertical: 'center' }}>
								Объем посадки
							</Text>
							<Text style={{ flex: 0.5, textAlignVertical: 'center' }}>Кнопки</Text>
						</View>
						<FlatList
							data={plantsData[gardenId]}
							renderItem={(item) => {
								return (
									<View
										style={{
											flexDirection: 'row',
											justifyContent: 'space-between',
										}}
									>
										<Text style={{ flex: 1, textAlignVertical: 'center' }}>
											{item.item.garden_plant_name}
										</Text>
										<Text style={{ flex: 1, textAlignVertical: 'center' }}>
											{item.item.planting_date}
										</Text>
										<Text style={{ flex: 1, textAlignVertical: 'center' }}>
											{item.item.planting_size}{' '}
											{item.item.planting_unit_short_name}
										</Text>
										<TouchableOpacity
											style={{ flex: 0.5 }}
											onPress={() => {
												deletePlant(item.item.id, gardenId);
											}}
										>
											<Icon name="delete-outline" size={30} color="red" />
										</TouchableOpacity>
									</View>
								);
							}}
						/>
						{plantsLoading[gardenId] ? <Indicator /> : null}
					</View>
					<View>
						<TouchableOpacity
							style={styles.addPlantBtn}
							onPress={() => navigation.navigate('AddPlant', { gardenId })}
						>
							<View style={styles.rowDirection}>
								<Icon name="plus" size={22} color="#8DC34A" />
								<Text style={{ fontSize: 15, marginLeft: 10, color: '#FF9800' }}>
									Добавить растение
								</Text>
							</View>
						</TouchableOpacity>
					</View>
				</View>
			);
		}
	};

	// eslint-disable-next-line react/destructuring-assignment
	if (screenLoading === true) {
		return <Indicator />;
	}
	return (
		<View style={{ flex: 1 }}>
			<View>
				<FlatList
					data={gardenData}
					renderItem={({ item }) => (
						<View>
							<View
								style={
									itemOpenIndex[item.id]
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

										if (itemOpenIndex[index] === true) {
											/* getPlantsData({ index }); */
											openGarden({ ...itemOpenIndex, [index]: false });
										} else {
											getPlantsData({ index });
											openGarden({ ...itemOpenIndex, [index]: true });
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
					)}
				/>
			</View>
			{addGarden()}
		</View>
	);
};

const mapStateToProps = ({ garden }) => {
	const {
		gardenName,
		gardenDescription,
		csrf,
		screenLoading,
		gardenData,
		openGardenId,
		addBtnSwitch,
		buttonLoading,
		itemLoading,
		itemOpenIndex,
		editButton,
		gardenId,
		plantsData,
		plantsLoading,
	} = garden;
	return {
		gardenName,
		gardenDescription,
		csrf,
		screenLoading,
		gardenData,
		openGardenId,
		addBtnSwitch,
		buttonLoading,
		itemLoading,
		itemOpenIndex,
		editButton,
		gardenId,
		plantsData,
		plantsLoading,
	};
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
	addPlantBtn: {
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
		borderColor: '#8DC34A',
		borderWidth: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		height: 40,
		justifyContent: 'center',
	},
	rowDirection: {
		flexDirection: 'row',
	},
});

export default connect(mapStateToProps, {
	inputChange,
	getCsrf,
	getGardens,
	openGarden,
	addButtonSwitch,
	createGarden,
	deleteGarden,
	changeButtonAction,
	editGarden,
	updateGarden,
	getPlantsData,
	clearState,
})(GardenScreen);
