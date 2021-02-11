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
			<ActivityIndicator size="large" color="#379683" />
		</View>
	);

	const plantItem = () => {
		return plantData.map((item) => {
			console.log('ITEM', item);
			return (
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						borderBottomWidth: 2,
						borderBottomColor: '#379683',
					}}
					key={item.id}
				>
					<Text style={{ fontSize: 16 }}>{item.planting_date}</Text>
					<Text style={{ fontSize: 16 }}>
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
							<Icon name="pencil-outline" size={30} color="orange" />
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								console.log('ITEM', item);
								const plantId = item.id;
								const gardenId = item.garden_id;
								deletePlant(plantId, gardenId);
							}}
						>
							<Icon name="delete-outline" size={30} color="red" />
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
						borderTopColor: '#379683',
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
						<Text style={{ fontSize: 16 }}>Дата посадки</Text>
						<Text style={{ fontSize: 16 }}>Объем посадки</Text>
						<Text style={{ fontSize: 16 }}>Управление</Text>
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
						paddingBottom: 10,
					}}
					onPress={() => setOpen(!open)}
				>
					<Text style={{ flex: 1, fontSize: 18 }}>{plantName}</Text>
					<Text style={{ flex: 1, textAlign: 'center', fontSize: 18 }}>
						{plantData.length}
					</Text>
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
