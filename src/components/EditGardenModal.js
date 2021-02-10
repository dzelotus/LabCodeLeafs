import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	KeyboardAvoidingView,
	Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import nodeApi from '../api/nodeApi';
import Indicator from './Indicator';

const EditGardenForm = (props) => {
	const { onClose, getGardens, gardenId } = props;
	const { control, handleSubmit, errors } = useForm();

	/* STATE */
	const [csrf, setCsrf] = useState();
	const [loading, setLoading] = useState({ buttonLoading: false, gardenDataLoading: true });
	const [gardenEditData, setGardenEditData] = useState(null);

	/* useEffect function */
	useEffect(() => {
		getCsrf();
		getGardenEditData();
	}, []);

	/* GET CSRF AND SET IT TO STATE */
	const getCsrf = () => {
		setLoading({ ...loading, buttonLoading: true });
		nodeApi
			.get('/garden/new')
			.then((response) => {
				console.log('getcsrf', response);
				setCsrf(response.data.csrfToken);
				setLoading({ ...loading, buttonLoading: false });
			})
			.catch((e) => {
				console.log('CSRF ERROR', e.response);
				setLoading({ ...loading, buttonLoading: false });
			});
	};

	/* GET GARDEN INFO FOR EDIT */
	const getGardenEditData = () => {
		nodeApi
			.get(`garden/${gardenId}/edit`)
			.then((response) => {
				setGardenEditData(response.data.data);
				setLoading({ gardenDataLoading: false });
			})
			.catch((error) => console.log(error));
	};

	/* CREATE GARDEN FUNCTION */

	const editGarden = (gardenName, gardenDescription) => {
		setLoading({ buttonLoading: true });
		nodeApi
			.put(`garden/${gardenId}`, {
				name: gardenName,
				description: gardenDescription,
				_csrf: csrf,
			})
			.then((response) => {
				console.log(response);
				getGardens();
				onClose();
			})
			.catch((error) => {
				console.log(error.response);
				onClose();
			});
	};

	/* REACT USE FORM SUBMIT FUNCTION */

	const onSubmit = (data) => {
		editGarden(data.gardenName_input, data.gardenDescription_input);
	};

	/* ADD GARDEN BUTTON */

	const AddGardenButton = () => {
		return (
			<TouchableOpacity style={styles.addButton} onPress={handleSubmit(onSubmit)}>
				<Icon name="plus" size={22} color="#379683" />
				<Text style={{ fontSize: 15, marginLeft: 10, color: '#EB9156' }}>
					Редактировать
				</Text>
			</TouchableOpacity>
		);
	};

	/* MODAL CONTENT WITH INPUTS, CLOSE AND ADD BUTTONS */

	return (
		<View style={styles.modalContainer}>
			<TouchableOpacity onPress={() => onClose()} style={styles.closeButton}>
				<Icon name="close" size={30} color="#379683" />
			</TouchableOpacity>
			<Text
				style={{
					textAlign: 'center',
					paddingTop: 10,
					paddingBottom: 15,
					fontSize: 20,
					color: '#EB9156',
				}}
			>
				Редактировать огород
			</Text>
			<View style={styles.controllerContainer}>
				<Controller
					control={control}
					/* rules={{
						required: {
							value: true,
							message: 'Обязательное поле',
						},
					}} */
					render={({ onChange, onBlur, value }) => (
						<View style={{ flex: 1 }}>
							<View style={styles.containerHeader}>
								<Text>Название огорода</Text>
							</View>
							<View style={styles.textInputContainer}>
								{gardenEditData ? (
									<TextInput
										onChangeText={onChange}
										onBlur={onBlur}
										textValue={value}
										defaultValue={gardenEditData.name.toString()}
										autoFocus
										style={{ flex: 1 }}
									/>
								) : (
									<Indicator />
								)}

								{errors.gardenName_input?.message && (
									<Text style={{ color: 'red' }}>
										{errors.gardenName_input.message}
									</Text>
								)}
							</View>
						</View>
					)}
					name="gardenName_input"
					defaultValue={gardenEditData ? gardenEditData.name : ''}
					key={gardenEditData ? 'nameLoaded' : 'nameLoading'}
				/>
			</View>
			<View style={styles.controllerContainer}>
				<Controller
					control={control}
					render={({ onChange, onBlur, value }) => (
						<View style={{ flex: 1 }}>
							<View style={styles.containerHeader}>
								<Text>Описание огорода</Text>
							</View>
							<View style={styles.textInputContainer}>
								{gardenEditData ? (
									<TextInput
										onChangeText={onChange}
										onBlur={onBlur}
										textValue={value}
										defaultValue={gardenEditData.description.toString()}
										s
										style={{ flex: 1 }}
									/>
								) : (
									<Indicator />
								)}

								{errors.gardenDescription_input?.message && (
									<Text style={{ color: 'red' }}>
										{errors.gardenDescription_input.message}
									</Text>
								)}
							</View>
						</View>
					)}
					name="gardenDescription_input"
					defaultValue={gardenEditData ? gardenEditData.description : ''}
					key={gardenEditData ? 'descriptionLoaded' : 'desctiptionLoaded'}
				/>
			</View>
			{!loading.buttonLoading ? (
				<AddGardenButton />
			) : (
				<Indicator style={{ marginBottom: 10, marginTop: 20 }} />
			)}
		</View>
	);
};

/* MAIN ADD GARDEN COMPONENT */

const EditGardenModal = (props) => {
	const [showModal, setShowModal] = useState(false);
	const { getGardens, gardenId } = props;
	console.log('EDIT PROPS', getGardens);

	return (
		<View>
			<TouchableOpacity
				onPress={() => {
					setShowModal(true);
				}}
			>
				<Icon name="pencil-outline" size={25} color="orange" />
			</TouchableOpacity>
			<Modal
				isVisible={showModal}
				style={{ flex: 1 }}
				onBackdropPress={() => setShowModal(false)}
				onSwipeComplete={() => setShowModal(false)}
				swipeDirection="down"
			>
				<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : null}>
					<EditGardenForm
						onClose={() => setShowModal(false)}
						getGardens={() => getGardens()}
						gardenId={gardenId}
					/>
				</KeyboardAvoidingView>
			</Modal>
		</View>
	);
};

/* STYLESHEET */

const styles = StyleSheet.create({
	headerText: {
		fontSize: 15,
		marginLeft: 10,
		color: '#EB9156',
	},
	button: {
		flexDirection: 'row',
		marginHorizontal: 5,
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
	modalContainer: {
		margin: 15,
		backgroundColor: 'white',
		borderRadius: 5,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	closeButton: {
		alignSelf: 'flex-end',
		right: 5,
		top: 5,
	},
	controllerContainer: {
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
	containerHeader: {
		marginTop: -12,
		marginHorizontal: 10,
		paddingHorizontal: 10,
		backgroundColor: 'white',
		position: 'absolute',
	},
	textInputContainer: {
		flex: 1,
		paddingHorizontal: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '99%',
	},
	addButton: {
		flexDirection: 'row',
		marginHorizontal: 15,
		marginBottom: 10,
		marginTop: 20,
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
});

export default EditGardenModal;
