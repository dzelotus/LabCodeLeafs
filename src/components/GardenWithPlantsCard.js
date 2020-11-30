/* eslint-disable consistent-return */
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PlantInGarden from './PlantInGarden';
import nodeApi from '../api/nodeApi';

const GardenWithPlantsCard = ({ data, nav, editGarden, getGardens }) => {
	const [open, setOpen] = useState(false);
	const [gardenPlants, setGardenPlants] = useState(null);
	const [loading, setLoading] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [deleted, setDeleted] = useState(null);
	const gardenId = data.id;

	const getGardenPlants = () => {
		setLoading(true);
		nodeApi
			.get(`/garden-planting/${gardenId}`)
			.then((response) => {
				const gardenData = groupObjectArrayByKey(response.data.data, 'garden_plant_name');
				setGardenPlants(gardenData);
				setLoading(false);
			})
			.catch((error) => console.log('ERR', error.response));
	};

	console.log('OPEN', open);
	useEffect(() => {
		getGardenPlants();
	}, [nav]);

	const deleteAlert = (gardenId) => {
		console.log('ALERT', gardenId);
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
						setDeleteLoading(true);
						nodeApi
							.delete(`garden/${gardenId}`)
							.then(() => {
								getGardens({ deleteLoading: true });
								setDeleteLoading(false);
								setDeleted(true);
							})
							.catch((error) => {
								console.log(error.response);
							});
					},
				},
			],
		);
	};

	const groupObjectArrayByKey = (arrayOfObjects, groupKey) => {
		return arrayOfObjects.reduce((groups, item) => {
			const group = groups[item[groupKey]] || [];
			group.push(item);

			groups[item[groupKey]] = group;

			return groups;
		}, {});
	};

	const plantsNames = () => {
		if (gardenPlants) {
			return Object.keys(gardenPlants).map((item) => {
				return (
					<PlantInGarden
						plantName={item}
						plantData={gardenPlants[item]}
						getGardenPlants={() => getGardenPlants()}
						nav={nav}
						key={item}
					/>
				);
			});
		}
	};

	const gardenOpen = () => {
		if (open) {
			return (
				<View style={{ flex: 1, marginHorizontal: 10, paddingVertical: 5 }}>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'flex-end',
							borderTopWidth: 2,
							borderTopColor: '#dedede',
							borderBottomWidth: 2,
							borderBottomColor: '#8DC34A',
						}}
					>
						<TouchableOpacity
							onPress={() => {
								editGarden(gardenId);
							}}
						>
							<Icon name="pencil-outline" size={25} color="orange" />
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								deleteAlert(gardenId);
							}}
						>
							<Icon name="delete-outline" size={25} color="red" />
						</TouchableOpacity>
					</View>
					<View>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								borderBottomWidth: 2,
								borderBottomColor: '#dedede',
								paddingVertical: 5,
							}}
						>
							<Text style={{ flex: 1 }}>Название растения</Text>
							<Text style={{ flex: 1, textAlign: 'center' }}>Количество записей</Text>
							<View style={{ flex: 0.2 }} />
						</View>
						{loading ? <Indicator /> : plantsNames()}
					</View>
					<View>
						<TouchableOpacity
							style={styles.addPlantBtn}
							onPress={() => nav.navigate('AddPlant', { gardenId })}
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

	const Indicator = () => {
		return (
			<View>
				<ActivityIndicator size="large" color="#8DC34A" />
			</View>
		);
	};
	if (deleted) {
		return null;
	}
	return (
		<View>
			<View style={open ? styles.gardenContainerPressed : styles.gardenContainerNormal}>
				<TouchableOpacity
					style={{
						flexDirection: 'row',
						flex: 1,
						justifyContent: 'space-between',
						padding: 10,
					}}
					onPress={() => {
						setOpen(!open);
						getGardenPlants();
					}}
				>
					<Text>{data.name}</Text>
					<Text>{data.description}</Text>
					<Icon name={open ? 'chevron-up' : 'chevron-down'} size={20} />
				</TouchableOpacity>
			</View>
			<View style={styles.gardenContainerOpened}>
				{deleteLoading ? <Indicator /> : gardenOpen()}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	gardenContainerNormal: {
		marginHorizontal: 10,
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
	},
	gardenContainerPressed: {
		marginHorizontal: 10,
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
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
	},
	gardenContainerOpened: {
		marginHorizontal: 10,
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

		borderTopLeftRadius: 0,
		borderTopRightRadius: 0,
		marginBottom: 5,
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

export default GardenWithPlantsCard;
