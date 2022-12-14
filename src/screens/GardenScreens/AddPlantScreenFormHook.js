/* 
Экран добавления растения в "огород". Используется на вкладке "Дневник садовода"
*/

/* eslint-disable radix */
/* eslint-disable operator-linebreak */
/* eslint-disable indent */
/* eslint-disable arrow-body-style */
/* eslint-disable react/no-array-index-key */
/* NPM */
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, findNodeHandle } from 'react-native';
import moment from 'moment';
import { useForm, Controller } from 'react-hook-form';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

/* OTHER */
import PickerModal from '../../components/PickerModal';
import nodeApi from '../../api/nodeApi';
import Indicator from '../../components/Indicator';

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

	const editP = () => {
		if (props.route.params.plantId) {
			const { plantId } = props.route.params;
			nodeApi
				.get(`/garden-planting/${gardenId}/planting/${plantId}/edit`)
				.then((response) => {
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
				const plantsForMap = response.data.data;
				const plantsData = plantsForMap.map((item) => {
					return { id: item.id, value: item.general_russian_name };
				});
				setPlants(plantsData);
			})
			.catch((error) => console.log('PLANT ERROR', error));
	};

	const getPlantsUnits = () => {
		nodeApi
			.get('/garden-plant-unit')
			.then((response) => {
				const unitsForMap = response.data.data;
				const unitsData = unitsForMap.map((item) => {
					return { id: item.id, value: item.name };
				});
				setUnit(unitsData);
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
		navigation.setOptions({
			headerTitle: editData ? 'Редактировать растение' : 'Добавить растение',
			headerTruncatedBackTitle: 'Назад',
		});
	}, []);

	const ButtonWithActivityIndicator = () => {
		if (loading.buttonLoading) {
			return (
				<Indicator
					style={{
						backgroundColor: 'white',
						flex: 1,
					}}
				/>
			);
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

	const scrollViewRef = useRef(null);

	const focusTextInput = (nodeHand) => {
		console.log('REF2', scrollViewRef.current);

		scrollViewRef.current.scrollIntoView(nodeHand);
	};

	if (!plants && !unit) {
		return (
			<Indicator
				style={{
					backgroundColor: 'white',
					flex: 1,
				}}
			/>
		);
	}
	return (
		<KeyboardAwareScrollView
			style={{ backgroundColor: 'white' }}
			keyboardShouldPersistTaps="always"
			onKeyboardWillShow={() => console.log('KEYBOARD')}
			ref={scrollViewRef}
		>
			<View
				style={{
					backgroundColor: 'white',
					paddingVertical: 10,
				}}
				keyboardShouldPersistTaps="always"
			>
				<View style={styles.container}>
					<Controller
						control={control}
						rules={{
							required: {
								value: true,
								message: 'Необходимо выбрать растение',
							},
						}}
						render={({ onChange, value }) => (
							<View style={{ flex: 1 }}>
								<View style={styles.containerHeader}>
									<Text>Растение</Text>
								</View>
								<View
									style={{
										flex: 1,
										paddingHorizontal: 10,
										flexDirection: 'row',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}
								>
									<PickerModal
										plantsData={plants}
										value={value}
										onValueChange={(value) => {
											onChange(value);
										}}
										placeholder="Выберите растение"
										route="/garden-plant"
										key="namePicker"
									/>
									{errors.garden_plant_id?.message && (
										<Text style={{ color: 'red' }}>
											{errors.garden_plant_id.message}
										</Text>
									)}
								</View>
							</View>
						)}
						name="garden_plant_id"
						defaultValue={editData ? Number.parseInt(editData.garden_plant_id) : ''}
						key={editData ? 'plantLoaded' : 'plantLoading'}
					/>
				</View>
				<View style={styles.container}>
					<Controller
						control={control}
						render={({ onChange, value }) => (
							<View style={{ flex: 1 }}>
								<View style={styles.containerHeader}>
									<Text>Дата посадки</Text>
								</View>
								<View
									style={{
										flexDirection: 'row',
										justifyContent: 'space-between',
										paddingHorizontal: 10,
										paddingVertical: 10,
										alignItems: 'center',
									}}
								>
									<Text style={{ textAlignVertical: 'center' }}>
										{moment(value).format('DD/MM/YYYY')}
									</Text>
									<TouchableOpacity onPress={() => setShow(true)}>
										<Icon name="calendar" size={30} />
									</TouchableOpacity>
								</View>
								<DateTimePickerModal
									isVisible={show}
									mode="date"
									onConfirm={(value) => {
										const currentDate = value;
										setShow(false);
										onChange(currentDate);
									}}
									onCancel={() => setShow(false)}
								/>
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
						rules={{
							required: {
								value: true,
								message: 'Не выбрана единица измерения',
							},
						}}
						render={({ onChange, value }) => (
							<View style={{ flex: 1 }}>
								<View style={styles.containerHeader}>
									<Text>Единицы измерения</Text>
								</View>
								<View
									style={{
										flex: 1,
										paddingHorizontal: 10,
										flexDirection: 'row',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}
								>
									<PickerModal
										plantsData={unit}
										value={value}
										onValueChange={(value) => {
											onChange(value);
										}}
										placeholder="Выберите ед. изм."
										route="/garden-plant-unit"
										key="unitPicker"
									/>
									{errors.planting_unit?.message && (
										<Text style={{ color: 'red' }}>
											{errors.planting_unit.message}
										</Text>
									)}
								</View>
							</View>
						)}
						name="planting_unit"
						defaultValue={editData ? Number.parseInt(editData.planting_unit) : ''}
						key={editData ? 'unitLoaded' : 'unitLoading'}
					/>
				</View>
				<View style={styles.container}>
					<Controller
						control={control}
						rules={{
							required: {
								value: true,
								message: 'Необходимо указать размер посдаки посадки',
								pattern: /^[0-9.,]+$/,
							},
						}}
						render={({ onChange, onBlur, value }) => (
							<View style={{ flex: 1 }}>
								<View style={styles.containerHeader}>
									<Text>Размер посадки</Text>
								</View>
								<View
									style={{
										flex: 1,
										paddingHorizontal: 10,
										flexDirection: 'row',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}
								>
									<TextInput
										onChangeText={onChange}
										onBlur={onBlur}
										textValue={value}
										defaultValue={value.toString()}
										keyboardType="number-pad"
										style={{ flex: 1 }}
									/>
									{errors.planting_size?.message && (
										<Text style={{ color: 'red' }}>
											{errors.planting_size.message}
										</Text>
									)}
								</View>
							</View>
						)}
						name="planting_size"
						defaultValue={editData ? editData.planting_size : ''}
						key={editData ? 'sizeLoaded' : 'plantLoading'}
					/>
				</View>

				<View style={styles.notesContainer}>
					<Controller
						control={control}
						render={({ onChange, onBlur, value }) => (
							<View style={{ flex: 1 }}>
								<View style={styles.containerHeader}>
									<Text>Заметки</Text>
								</View>
								<TextInput
									onFocus={(event) => {
										focusTextInput(findNodeHandle(event.target));
									}}
									multiline
									onChangeText={onChange}
									onBlur={onBlur}
									textValue={value}
									style={{
										flex: 1,
										paddingLeft: 10,
										paddingTop: 10,
									}}
								/>
							</View>
						)}
						name="description"
						defaultValue=""
						key={editData ? 'notesLoaded' : 'notesLoading'}
					/>
				</View>

				<ButtonWithActivityIndicator />
			</View>
		</KeyboardAwareScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
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
		height: 50,
	},
	notesContainer: {
		marginHorizontal: 15,
		marginTop: 10,
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
		flex: 1,
		height: 150,
	},
	labelContainer: {
		position: 'absolute',

		top: -15,
		left: 25,
		padding: 5,
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
	rowDirection: {
		flexDirection: 'row',
	},
});

export default AddPlantScreenFormHook;
