/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	ActivityIndicator,
	TouchableOpacity,
	TextInput,
	StyleSheet,
	ScrollView,
} from 'react-native';
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import nodeApi from '../api/nodeApi';

const AddPlantScreen = () => {
	const [loading, setLoading] = useState(true);
	const [plants, setPlants] = useState('Select');
	const [unit, setUnit] = useState('Select');
	const [picker, setPicker] = useState();
	const [unitPicker, setUnitPicker] = useState();
	const [show, setShow] = useState(false);
	const [date, setDate] = useState();

	const getPlantsName = () => {
		nodeApi
			.get('/garden-plant')
			.then((response) => {
				setPlants(response.data.data);
			})
			.catch((error) => console.log('PLANT ERROR', error));
	};

	const getPlantsUnits = () => {
		nodeApi
			.get('/garden-plant-unit')
			.then((response) => {
				setUnit(response.data.data);
				setLoading(false);
			})
			.catch((error) => console.log(error.response));
	};

	console.log('PLANTS', plants);
	console.log('PICKER', unitPicker);

	const onChange = (event, selectedDate) => {
		const currentDate = selectedDate || date;
		setShow(false);
		setDate(moment(currentDate).format('DD/MM/YYYY'));
	};

	useEffect(() => {
		getPlantsName();
		getPlantsUnits();
	}, []);

	const Indicator = () => (
		<View>
			<ActivityIndicator size="large" color="#8DC34A" />
		</View>
	);
	if (loading) {
		return <Indicator />;
	}
	return (
		<ScrollView style={{ flex: 1 }}>
			<View style={styles.container}>
				<View style={{ borderColor: 'red', borderWidth: 1, height: 30 }}>
					<Text>Растение</Text>
				</View>
				<Picker
					selectedValue={picker}
					onValueChange={(itemValue) => {
						setPicker(itemValue);
					}}
					mode="dropdown"
					style={{ borderColor: 'blue', borderWidth: 1, flex: 1 }}
				>
					<Picker.Item label="Выберите растение" value={0} />
					{plants.map((item, index) => (
						<Picker.Item
							label={item.general_russian_name.toString()}
							value={index + 1}
							key={index}
						/>
					))}
				</Picker>
			</View>
			<View style={styles.container}>
				<View style={{ flexDirection: 'row' }}>
					<Text>{date}</Text>
					<TouchableOpacity onPress={() => setShow(true)}>
						<Icon name="calendar" size={30} />
					</TouchableOpacity>
				</View>
				{show && (
					<DateTimePicker
						minimumDate={new Date(1901, 0, 1)}
						maximumDate={new Date()}
						testID="datePicker"
						value={new Date()}
						mode="date"
						display="default"
						onChange={onChange}
					/>
				)}
			</View>
			<View style={styles.container}>
				<Text>Размер посадки</Text>
				<TextInput placeholder="Размер посадки" />
			</View>
			<View style={styles.container}>
				<Text>Единицы измерения посадки</Text>
				<Picker
					selectedValue={unitPicker}
					onValueChange={(itemValue) => {
						setUnitPicker(itemValue);
					}}
					mode="dropdown"
				>
					<Picker.Item label="Выберите единицу измерения" value={0} />
					{unit.map((item, index) => (
						<Picker.Item label={item.name.toString()} value={index + 1} key={index} />
					))}
				</Picker>
			</View>
			<View style={styles.container}>
				<Text>Заметки</Text>
				<TextInput multiline />
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
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
		flex: 1,
	},
	labelContainer: {
		position: 'absolute',

		top: -15,
		left: 25,
		padding: 5,
		zIndex: 50,
	},
	textInput: {
		flex: 1,
		borderWidth: 1,
		borderColor: '#8DC34A',
		justifyContent: 'flex-end',
		height: 44,
		borderRadius: 65,
		paddingHorizontal: 25,
	},
});

export default AddPlantScreen;
