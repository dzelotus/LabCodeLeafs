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
import { ScrollView } from 'react-native-gesture-handler';
import nodeApi from '../api/nodeApi';
import Indicator from './Indicator';

const AddGardenForm = (props) => {
	const { onClose, getGardens } = props;
	const { control, handleSubmit, errors } = useForm();

	/* STATE */
	const [csrf, setCsrf] = useState();
	const [loading, setLoading] = useState();

	/* useEffect function */
	useEffect(() => {
		getCsrf();
	}, []);

	/* GET CSRF AND SET IT TO STATE */
	const getCsrf = () => {
		setLoading(true);
		nodeApi
			.get('/garden/new')
			.then((response) => {
				console.log('getcsrf', response);
				setCsrf(response.data.csrfToken);
				setLoading(false);
			})
			.catch((e) => {
				console.log('CSRF ERROR', e.response);
				setLoading(false);
			});
	};

	/* CREATE GARDEN FUNCTION */

	const createGarden = (gardenName, gardenDescription) => {
		setLoading(true);
		nodeApi
			.post('/garden', {
				name: gardenName,
				description: gardenDescription,
				_csrf: csrf,
			})
			.then((response) => {
				console.log('CREATE GARDEN RESPONSE', response.data);
				getGardens();
				onClose();
				setLoading(false);
			})
			.catch((error) => {
				console.log('CREATE ERROR', error.response);
				setLoading(false);
			});
	};

	/* REACT USE FORM SUBMIT FUNCTION */

	const onSubmit = (data) => {
		console.log('SUBMIT DATA', data);
		createGarden(data.gardenName_input, data.gardenDescription_input);
	};

	/* ADD GARDEN BUTTON */

	const AddGardenButton = () => {
		return (
			<TouchableOpacity style={styles.addButton} onPress={handleSubmit(onSubmit)}>
				<Icon name="plus" size={22} color="#379683" />
				<Text style={{ fontSize: 15, marginLeft: 10, color: '#EB9156' }}>Добавить</Text>
			</TouchableOpacity>
		);
	};

	/* MODAL CONTENT WITH INPUTS, CLOSE AND ADD BUTTONS */

	return (
		<View style={styles.modalContainer}>
			<View
				style={{
					height: 25,
					justifyContent: 'center',
				}}
			>
				<View
					style={{
						borderColor: '#379683',
						borderWidth: 3,
						marginHorizontal: 50,
						borderRadius: 3,
					}}
				/>
			</View>
			<ScrollView keyboardShouldPersistTaps="always">
				<Text style={styles.title}>Добавить огород</Text>
				<View style={styles.controllerContainer}>
					<Controller
						control={control}
						rules={{
							required: {
								value: true,
								message: 'Обязательное поле',
							},
						}}
						render={({ onChange, onBlur, value }) => (
							<View style={{ flex: 1 }}>
								<View style={styles.containerHeader}>
									<Text>Название огорода</Text>
								</View>
								<View style={styles.textInputContainer}>
									<TextInput
										onChangeText={onChange}
										onBlur={onBlur}
										textValue={value}
										defaultValue={value.toString()}
										style={{ flex: 1 }}
									/>
									{errors.gardenName_input?.message && (
										<Text style={{ color: 'red' }}>
											{errors.gardenName_input.message}
										</Text>
									)}
								</View>
							</View>
						)}
						name="gardenName_input"
						defaultValue=""
						key="name"
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
									<TextInput
										onChangeText={onChange}
										onBlur={onBlur}
										textValue={value}
										defaultValue={value.toString()}
										style={{ flex: 1 }}
									/>
									{errors.gardenDescription_input?.message && (
										<Text style={{ color: 'red' }}>
											{errors.gardenDescription_input.message}
										</Text>
									)}
								</View>
							</View>
						)}
						name="gardenDescription_input"
						defaultValue=""
					/>
				</View>
				{!loading ? (
					<AddGardenButton />
				) : (
					<Indicator style={{ marginBottom: 10, marginTop: 20 }} />
				)}
			</ScrollView>
		</View>
	);
};

/* MAIN ADD GARDEN COMPONENT */

const AddGardenModal = (props) => {
	const [showModal, setShowModal] = useState(false);
	const { getGardens } = props;

	return (
		<View>
			<TouchableOpacity style={styles.button} onPress={() => setShowModal(true)}>
				<Icon name="plus" size={22} color="#379683" />
				<Text style={styles.headerText}>Добавить огород</Text>
			</TouchableOpacity>
			<Modal
				isVisible={showModal}
				onBackdropPress={() => setShowModal(false)}
				onSwipeComplete={() => setShowModal(false)}
				swipeDirection="down"
				style={{
					justifyContent: 'flex-end',
					margin: 0,
				}}
			>
				<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : null}>
					<AddGardenForm
						onClose={() => setShowModal(false)}
						getGardens={() => getGardens()}
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
		backgroundColor: 'white',
		borderTopRightRadius: 25,
		borderTopLeftRadius: 25,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		paddingBottom: 50,
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
	title: {
		textAlign: 'center',
		paddingTop: 10,
		paddingBottom: 15,
		fontSize: 20,
		color: '#EB9156',
	},
});

export default AddGardenModal;
