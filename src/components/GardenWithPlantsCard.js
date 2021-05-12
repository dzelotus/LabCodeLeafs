/* eslint-disable consistent-return */

/* NPM */
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

/* OTHER */
import PlantInGarden from './PlantInGarden';
import nodeApi from '../api/nodeApi';
import EditGardenModal from './EditGardenModal';
import Indicator from './Indicator';

const GardenWithPlantsCard = ({ data, getGardens, nav }) => {
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
			.catch((error) => {
				console.log('ERR', error.response);
				setLoading(false);
			});
	};

	useEffect(() => {
		const unsubscribe = nav.addListener('focus', () => {
			getGardenPlants();
		});

		return unsubscribe;
	}, [nav]);

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
						key={item}
					/>
				);
			});
		}
	};

	const gardenOpen = () => {
		if (open) {
			return (
				<View style={styles.openedGardenContainer}>
					<View style={styles.gardenBtns}>
						<EditGardenModal gardenId={gardenId} getGardens={() => getGardens()} />
						<TouchableOpacity
							onPress={() => {
								deleteAlert(gardenId);
							}}
						>
							<Icon name="delete-outline" size={30} color="red" />
						</TouchableOpacity>
					</View>
					<View>
						<View style={styles.columnTitles}>
							<Text style={styles.column1}>Название растения</Text>
							<Text style={styles.column2}>Количество записей</Text>
							<View style={styles.column3} />
						</View>
						{loading && gardenPlants === null ? <Indicator /> : plantsNames()}
					</View>
					<View>
						<TouchableOpacity
							style={styles.addPlantBtn}
							onPress={() => nav.navigate('AddPlant', { gardenId })}
						>
							<View style={styles.rowDirection}>
								<Icon name="plus" size={22} color="#379683" />
								<Text style={styles.addPlantBtnTitle}>Добавить растение</Text>
							</View>
						</TouchableOpacity>
					</View>
				</View>
			);
		}
	};

	if (deleted) {
		return null;
	}
	return (
		<View>
			<View style={open ? styles.gardenContainerPressed : styles.gardenContainerNormal}>
				<TouchableOpacity
					style={styles.openGardenBtn}
					onPress={() => {
						setOpen(!open);
						getGardenPlants();
					}}
				>
					<Text style={styles.gardenTitle}>{data.name}</Text>
					<Text style={styles.gardenTitle}>{data.description}</Text>
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
		marginHorizontal: 5,
		marginTop: 15,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		borderRadius: 10,
		borderColor: '#000',
		backgroundColor: '#fff',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	gardenContainerPressed: {
		marginHorizontal: 5,
		marginTop: 15,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		borderRadius: 10,
		borderColor: '#000',
		backgroundColor: '#fff',
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
	},
	gardenContainerOpened: {
		marginHorizontal: 5,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
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
	},
	addPlantBtnTitle: { fontSize: 15, marginLeft: 10, color: '#EB9156' },
	rowDirection: {
		flexDirection: 'row',
	},
	openGardenBtn: {
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'space-between',
		padding: 20,
	},
	gardenTitle: { fontSize: 16 },
	openedGardenContainer: { flex: 1, marginHorizontal: 10, paddingVertical: 5 },
	gardenBtns: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		borderBottomWidth: 2,
		borderBottomColor: '#379683',
	},
	columnTitles: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderBottomWidth: 2,
		borderBottomColor: '#dedede',
		paddingVertical: 10,
	},
	column1: { flex: 1, fontSize: 16 },
	column2: { flex: 1, textAlign: 'center', fontSize: 16 },
	column3: { flex: 0.2 },
});

export default GardenWithPlantsCard;
