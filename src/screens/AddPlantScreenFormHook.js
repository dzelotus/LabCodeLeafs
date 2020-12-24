/* eslint-disable radix */
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

const AddPlantScreenFormHook = (props) => {
	const [loading, setLoading] = useState({ screenLoading: true, buttonLoading: false });
	const [plants, setPlants] = useState(null);
	const [unit, setUnit] = useState(null);
	const [show, setShow] = useState(false);
	const [csrf, setCsrf] = useState();
	const [editData, setEditData] = useState(null);
	// eslint-disable-next-line react/destructuring-assignment
	const { gardenId } = props.route.params;
	const { navigation } = props;
	console.log(props);

	const screenTitle = () => navigation.setOptions({ title: 'ТАЙТЛ' });

	const editP = () => {
		if (props.route.params.plantId) {
			const { plantId } = props.route.params;
			nodeApi
				.get(`/garden-planting/${gardenId}/planting/${plantId}/edit`)
				.then((response) => {
					console.log(response.data);
					setEditData(response.data.data);
					setCsrf(response.data.csrfToken);
				})
				.catch((error) => console.log(error));
		} else {
			console.log('NO');
		}
	};

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
		editP();
		getPlantsName();
		getPlantsUnits();
		getCsrf();
		screenTitle();
	}, []);

	const Indicator = () => (
		<View>
			<ActivityIndicator size="large" color="#379683" />
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
						<Icon name="plus" size={22} color="#379683" />
						<Text style={{ fontSize: 15, marginLeft: 10, color: '#FF9800' }}>
							{editData ? 'Редактировать растение' : 'Добавить растение'}
						</Text>
					</View>
				</TouchableOpacity>
			</View>
		);
	};

	const { control, handleSubmit, errors } = useForm();
	const onSubmit = (data) => {
		setLoading({ ...loading, buttonLoading: true });
		console.log('DATA', data);
		console.log(gardenId);
		if (editData) {
			nodeApi
				.put(`/garden-planting/${editData.garden_id}/planting/${editData.id}`, {
					...data,
					_csrf: csrf,
				})
				.then(() => {
					setLoading({ ...loading, buttonLoading: false });
					navigation.navigate('Garden', { reload: true });
				})
				.catch((error) => {
					console.log('POST ERROR', error.response);
					setLoading({ ...loading, buttonLoading: false });
				});
		} else {
			nodeApi
				.post(`/garden-planting/${gardenId}`, { ...data, _csrf: csrf })
				.then(() => {
					setLoading({ ...loading, buttonLoading: false });
					navigation.navigate('Garden');
				})
				.catch((error) => {
					console.log('POST ERROR', error.response);
					setLoading({ ...loading, buttonLoading: false });
				});
		}
	};

	console.log('ERRORS', errors);

	const InputError = () => {
		return (
			<View style={{ justifyContent: 'flex-end', alignSelf: 'flex-end' }}>
				<Text style={{ color: 'red' }}>Check</Text>
			</View>
		);
	};

	if (loading.screenLoading) {
		return <Indicator />;
	}
	return (
		<ScrollView
			style={{ flex: 1, backgroundColor: 'white', paddingVertical: 10 }}
			keyboardShouldPersistTaps="always"
		>
			<View style={styles.container}>
				<Controller
					control={control}
					rules={{
						required: true,
						pattern: {
							value: 1,
							message: 'FAIL',
						},
						validate: {},
					}}
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
					defaultValue={editData ? Number.parseInt(editData.garden_plant_id) : '0'}
					key={editData ? 'plantLoaded' : 'plantLoading'}
				/>
				{errors.garden_plant_id && <Text style={{ color: 'red', zIndex: 100 }}>ChECK</Text>}
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
					defaultValue={editData ? new Date(editData.planting_date) : new Date()}
					key={editData ? 'datetLoaded' : 'datetLoading'}
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
					defaultValue={editData ? Number.parseInt(editData.planting_unit) : '0'}
					key={editData ? 'unitLoaded' : 'unitLoading'}
				/>
			</View>
			<View style={styles.container}>
				<Controller
					control={control}
					rules={{ required: 'WHAT' }}
					render={({ onChange, onBlur, value }) => (
						<View>
							<View style={styles.containerHeader}>
								<Text>Размер посадки</Text>
							</View>
							<TextInput
								onChangeText={onChange}
								onBlur={onBlur}
								textValue={value}
								style={{ paddingHorizontal: 10 }}
								defaultValue={value.toString()}
							/>
						</View>
					)}
					name="planting_size"
					defaultValue={editData ? editData.planting_size : ''}
					key={editData ? 'sizeLoaded' : 'plantLoading'}
				/>
				{errors.planting_size && <InputError />}
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
					key={editData ? 'notesLoaded' : 'notesLoading'}
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
		borderColor: '#379683',
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
		borderColor: '#379683',
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
		borderColor: '#379683',
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
		borderColor: '#379683',
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
