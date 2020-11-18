/* eslint-disable operator-linebreak */
/* eslint-disable indent */
/* eslint-disable arrow-body-style */
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
import { useForm, Controller } from 'react-hook-form';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import nodeApi from '../api/nodeApi';

const AddPlantScreenFormHook = ({ route }) => {
	const [loading, setLoading] = useState({ screenLoading: true, buttonLoading: false });
	const [plants, setPlants] = useState(null);
	const [unit, setUnit] = useState(null);
	const [show, setShow] = useState(false);
	const [csrf, setCsrf] = useState();
	const { gardenId } = route.params;

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
				setLoading({ ...loading, screenLoading: false });
			})
			.catch((error) => console.log(error.response));
	};

	const getCsrf = () => {
		nodeApi
			.get(`/garden-planting/${gardenId}/new`)
			.then((response) => {
				console.log(response.data.csrfToken);
				setCsrf(response.data.csrfToken);
			})
			.catch((error) => console.log(error));
	};

	useEffect(() => {
		getPlantsName();
		getPlantsUnits();
		getCsrf();
	}, []);

	const Indicator = () => (
		<View>
			<ActivityIndicator size="large" color="#8DC34A" />
		</View>
	);

	const ButtonWithActivityIndicator = () => {
		if (loading.buttonLoading) {
			return <Indicator />;
		}
		return (
			<View>
				<TouchableOpacity style={styles.addPlantBtn} onPress={handleSubmit(onSubmit)}>
					<View style={styles.rowDirection}>
						<Icon name="plus" size={22} color="#8DC34A" />
						<Text style={{ fontSize: 15, marginLeft: 10, color: '#FF9800' }}>
							Добавить растение
						</Text>
					</View>
				</TouchableOpacity>
			</View>
		);
	};

	const { control, handleSubmit } = useForm();
	const onSubmit = (data) => {
		setLoading({ ...loading, buttonLoading: true });
		console.log('DATA', data);
		console.log(gardenId);
		nodeApi
			.post(`/garden-planting/${gardenId}`, { ...data, _csrf: csrf })
			.then((response) => {
				console.log('POST RESPONSE', response);
				setLoading({ ...loading, buttonLoading: false });
			})
			.catch((error) => console.log('POST ERROR', error.response));
	};

	if (loading.screenLoading) {
		return <Indicator />;
	}
	return (
		<ScrollView style={{ flex: 1, backgroundColor: 'white', paddingVertical: 10 }}>
			<View style={styles.container}>
				<Controller
					control={control}
					render={({ onChange, value }) => (
						<View>
							<View style={styles.containerHeader}>
								<Text>Растение</Text>
							</View>
							<Picker
								selectedValue={value}
								onValueChange={(value) => {
									onChange(value);
								}}
								mode="dropdown"
							>
								<Picker.Item label="Выберите растение" value={0} />
								{plants
									? plants.map((item, index) => {
											return (
												<Picker.Item
													label={item.general_russian_name.toString()}
													value={index + 1}
													key={index}
												/>
											);
									  })
									: null}
							</Picker>
						</View>
					)}
					name="garden_plant_id"
					defaultValue="0"
				/>
			</View>
			<View style={styles.container}>
				<Controller
					control={control}
					render={({ onChange, value }) => (
						<View>
							<View style={styles.containerHeader}>
								<Text style={{ textAlign: 'center' }}>Дата посадки</Text>
							</View>
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'space-between',
									paddingHorizontal: 10,
									paddingVertical: 10,
								}}
							>
								<Text style={{ textAlignVertical: 'center' }}>
									{moment(value).format('DD/MM/YYYY')}
								</Text>
								<TouchableOpacity onPress={() => setShow(true)}>
									<Icon name="calendar" size={30} />
								</TouchableOpacity>
							</View>
							{show && (
								<DateTimePicker
									minimumDate={new Date(1901, 0, 1)}
									maximumDate={new Date()}
									testID="datePicker"
									value={value}
									mode="date"
									display="default"
									onChange={(event, value) => {
										const currentDate = value;
										setShow(false);
										onChange(currentDate);
									}}
								/>
							)}
						</View>
					)}
					name="planting_date"
					defaultValue={new Date()}
				/>
			</View>
			<View style={styles.container}>
				<Controller
					control={control}
					render={({ onChange, value }) => (
						<View>
							<View style={styles.containerHeader}>
								<Text>Единицы измерения посадки</Text>
							</View>
							<Picker
								selectedValue={value}
								onValueChange={(value) => {
									onChange(value);
								}}
								mode="dropdown"
							>
								<Picker.Item label="Выберите единицу измерения" value={0} />
								{unit.map((item, index) => (
									<Picker.Item
										label={item.name.toString()}
										value={index + 1}
										key={index}
									/>
								))}
							</Picker>
						</View>
					)}
					name="planting_unit"
					defaultValue=""
				/>
			</View>
			<View style={styles.container}>
				<Controller
					control={control}
					render={({ onChange, onBlur, value }) => (
						<View>
							<View style={styles.containerHeader}>
								<Text>Размер посадки</Text>
							</View>
							<TextInput
								placeholder="Размер посадки"
								onChangeText={onChange}
								onBlur={onBlur}
								textValue={value}
								style={{ paddingHorizontal: 10 }}
							/>
						</View>
					)}
					name="planting_size"
					defaultValue=""
				/>
			</View>

			<View style={styles.notesContainer}>
				<Controller
					control={control}
					render={({ onChange, onBlur, value }) => (
						<View>
							<View style={styles.containerHeader}>
								<Text>Заметки</Text>
							</View>
							<TextInput
								multiline
								onChangeText={onChange}
								onBlur={onBlur}
								textValue={value}
								style={{ paddingHorizontal: 10, height: 150 }}
							/>
						</View>
					)}
					name="description"
					defaultValue=""
				/>
			</View>
			<ButtonWithActivityIndicator />
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
		height: 50,
	},
	notesContainer: {
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
		borderColor: '#8DC34A',
		borderWidth: 1,
		backgroundColor: '#fff',
		flex: 1,
		height: 150,
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
	containerHeader: {
		marginTop: -12,
		marginHorizontal: 10,
		paddingHorizontal: 10,
		backgroundColor: 'white',
		position: 'absolute',
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

export default AddPlantScreenFormHook;
