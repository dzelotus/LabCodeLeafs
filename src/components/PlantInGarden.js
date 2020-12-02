/* eslint-disable consistent-return */
import React, { useState } from 'react';
import { Text, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as RootNavigation from '../RootNavigation';
import nodeApi from '../api/nodeApi';

const PlantInGarden = ({ plantName, plantData, getGardenPlants }) => {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const deletePlant = (plantId, gardenId) => {
		Alert.alert('Предупреждение', 'Вы точно хотите удалить растение?', [
			{ text: 'Отменить' },
			{
				text: 'Удалить',
				onPress: () => {
					setLoading(true);
					nodeApi
						.delete(`/garden-planting/${gardenId}/planting/${plantId}`)
						.then(() => {
							setLoading(false);
							getGardenPlants();
						})
						.catch((error) => console.log(error.response));
				},
			},
		]);
	};

	const Indicator = () => (
		<View>
			<ActivityIndicator size="large" color="#8DC34A" />
		</View>
	);

	const plantItem = () => {
		return plantData.map((item) => {
			return (
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						borderBottomWidth: 2,
						borderBottomColor: '#8DC34A',
					}}
					key={item.id}
				>
					<Text>{item.planting_date}</Text>
					<Text>
						{item.planting_size} {item.planting_unit_short_name}
					</Text>
					<View style={{ flexDirection: 'row' }}>
						<TouchableOpacity
							onPress={() => {
								RootNavigation.navigate('AddPlant', {
									gardenId: item.garden_id,
									plantId: item.id,
								});
							}}
						>
							<Icon name="pencil-outline" size={25} color="orange" />
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								console.log('ITEM', item);
								const plantId = item.id;
								const gardenId = item.garden_id;
								deletePlant(plantId, gardenId);
							}}
						>
							<Icon name="delete-outline" size={25} color="red" />
						</TouchableOpacity>
					</View>
				</View>
			);
		});
	};

	const openedPlant = () => {
		if (open) {
			return (
				<View
					style={{
						margin: 10,
						borderTopWidth: 2,
						borderTopColor: '#8DC34A',
					}}
				>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							borderBottomWidth: 2,
							borderBottomColor: '#dedede',
							paddingVertical: 5,
						}}
					>
						<Text>Дата посадки</Text>
						<Text>Объем посадки</Text>
						<Text>Управление</Text>
					</View>
					{plantItem()}
				</View>
			);
		}
	};
	return (
		<View style={{ paddingVertical: 5 }}>
			<View>
				<TouchableOpacity
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						borderBottomWidth: 2,
						borderBottomColor: '#dedede',
					}}
					onPress={() => setOpen(!open)}
				>
					<Text style={{ flex: 1 }}>{plantName}</Text>
					<Text style={{ flex: 1, textAlign: 'center' }}>{plantData.length}</Text>
					<Icon
						name={open ? 'chevron-up' : 'chevron-down'}
						size={20}
						style={{ flex: 0.2 }}
					/>
				</TouchableOpacity>
			</View>
			{loading ? <Indicator /> : openedPlant()}
		</View>
	);
};
export default PlantInGarden;
