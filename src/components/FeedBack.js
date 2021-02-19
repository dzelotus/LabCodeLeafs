// *** NPM ***
import React, { useState, useEffect, useCallback } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';
import {
	StyleSheet,
	Alert,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	useWindowDimensions,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import axios from '../api/nodeApi';

// *** REGEX ***
// eslint-disable-next-line no-useless-escape
const regexEmail = /^([\w!.%+\-])+@([\w\-])+(?:\.[\w\-]+)+$/;

const FeedbackGeneralNew = (props) => {
	// *** FROM HOOK ***
	const { control, handleSubmit, errors } = useForm();

	// *** PROPS ***
	const { onClose, onPerform } = props;

	// *** USE STATE ***
	const [loadingState, setLoadingState] = useState(false);
	const [csrfState, setCsrfState] = useState(false);

	// *** FETCHING DATA ***
	const fetchNewFeedbackGeneral = useCallback(async () => {
		try {
			const response = await axios.get('/feedback/general/new');
			const { csrfToken } = response.data;

			setCsrfState(() => csrfToken);
		} catch (error) {
			// Close modal

			onClose();
			// Error alert
		}
	}, [onClose]);

	const fetchCreateFeedbackGeneral = async (feedbackData) => {
		try {
			await axios.post('/feedback/general', {
				...feedbackData,
				_csrf: csrfState,
			});

			// Success alert
			Alert.alert('Успешно', 'Ваш отзыв успешно отправлен. Спасибо!', [{ text: 'OK' }], {
				cancelable: false,
			});

			// successfully performed
			onPerform();
		} catch (error) {
			// Close modal
			onClose();

			// Error alert
			Alert.alert(
				'Ошибка',
				'Что-то пошло не так, пожалуйста свяжитесь с администратором',
				[{ text: 'OK' }],
				{
					cancelable: false,
				},
			);
		}
	};

	// *** HANDLERS ***
	const onSubmitHandler = async (data) => {
		setLoadingState(() => true);

		await fetchCreateFeedbackGeneral(data);

		setLoadingState(() => false);
	};

	// *** USE EFFECT ***
	// componentDidMount
	useEffect(() => {
		console.log('[FeedbackGeneralNew] componentDidMount');

		// fetch all needed data
		(async () => {
			setLoadingState(() => true);

			await fetchNewFeedbackGeneral();

			setLoadingState(() => false);
		})();
	}, [fetchNewFeedbackGeneral]);

	console.log('HEIGHT', useWindowDimensions().height);

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
				{/* TITLE */}
				<Text style={styles.title}>Оставить отзыв</Text>

				{/* INPUTS */}

				<View style={styles.controllerContainer}>
					<Controller
						control={control}
						render={({ onChange, value }) => (
							<View
								style={{
									flex: 1,
								}}
							>
								<View style={styles.containerHeader}>
									<Text>Ваше имя</Text>
								</View>
								<TextInput
									onChangeText={(newValue) => onChange(newValue)}
									value={value}
									style={{ flex: 1, paddingHorizontal: 10 }}
								/>
							</View>
						)}
						name="name"
						rules={{
							required: { value: true, message: 'Данное поле обязательное' },
							maxLength: { value: 100, message: 'Максимальная длина 100' },
						}}
						defaultValue=""
					/>
				</View>
				{/* NAME ERROR */}
				{errors.name?.message && (
					<Text style={styles.errorMessage}>{errors.name?.message}</Text>
				)}

				{/* EMAIL */}
				<View style={styles.controllerContainer}>
					<Controller
						control={control}
						render={({ onChange, value }) => (
							<View style={{ flex: 1 }}>
								<View style={styles.containerHeader}>
									<Text>Электронная почта</Text>
								</View>
								<View style={styles.textInputContainer}>
									<TextInput
										onChangeText={(newValue) => onChange(newValue)}
										value={value}
										style={{ flex: 1 }}
									/>
								</View>
							</View>
						)}
						name="email"
						rules={{
							required: { value: true, message: 'Данное поле обязательное' },
							maxLength: { value: 320, message: 'Максимальная длина 320' },
							pattern: { value: regexEmail, message: 'Неверный формат e-mail' },
						}}
						defaultValue=""
					/>
				</View>

				{/* EMAIL ERROR */}
				{errors.email?.message && (
					<Text style={styles.errorMessage}>{errors.email.message}</Text>
				)}

				{/* MESSAGE */}
				<View style={styles.feedbackControllerContainer}>
					<Controller
						control={control}
						render={({ onChange, value }) => (
							<View style={{ flex: 1 }}>
								<View style={styles.containerHeader}>
									<Text>Ваш отзыв</Text>
								</View>
								<View style={styles.textInputContainer}>
									<TextInput
										onChangeText={(newValue) => onChange(newValue)}
										value={value}
										multiline
										numberOfLines={10}
										style={{ flex: 1 }}
									/>
								</View>
							</View>
						)}
						name="message"
						rules={{
							required: { value: true, message: 'Данное поле обязательно' },
						}}
						defaultValue=""
					/>
				</View>

				{/* MESSAGE ERROR */}
				{errors.message?.message && (
					<Text style={styles.errorMessage}>{errors.message?.message}</Text>
				)}

				{/* SUBMIT */}
				{loadingState ? (
					<ActivityIndicator size="large" color="green" />
				) : (
					<TouchableOpacity
						style={styles.submitButton}
						onPress={handleSubmit(onSubmitHandler)}
					>
						<Text style={styles.submitButtonText}>Отправить</Text>
					</TouchableOpacity>
				)}
				{/* CLOSE */}
			</ScrollView>
		</View>
	);
};

const FeedBack = () => {
	// *** USE STATE ***
	const [modalVisibleState, setModalVisibleState] = useState(false);

	// *** HANDLERS ***
	const onPress = () => setModalVisibleState(() => !modalVisibleState);

	return (
		<View>
			{/* MAIN VIEW */}
			<TouchableOpacity onPress={onPress} style={styles.feedbackView}>
				<View style={styles.feedbackViewButton}>
					<Icon name="paper-plane-o" size={25} color="#379683" />
					<Text style={{ fontSize: 18, marginLeft: 15, color: '#EB9156' }}>
						Оставить отзыв
					</Text>
				</View>
			</TouchableOpacity>

			{/* MODAL */}

			<Modal
				isVisible={modalVisibleState}
				onBackdropPress={() => setModalVisibleState(() => false)}
				onSwipeComplete={() => setModalVisibleState(false)}
				useNativeDriver={false}
				swipeDirection="down"
				style={{
					justifyContent: 'flex-end',
					margin: 0,
					paddingTop: 30,
				}}
			>
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : null}
					style={{
						justifyContent: 'flex-end',
						maxHeight: useWindowDimensions().height - 75,
					}}
				>
					<FeedbackGeneralNew
						onClose={() => setModalVisibleState(() => false)}
						onPerform={() => setModalVisibleState(() => false)}
					/>
				</KeyboardAvoidingView>
			</Modal>
		</View>
	);
};

// *** STYLES ***
const styles = StyleSheet.create({
	feedbackView: {
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
		height: 50,
		justifyContent: 'center',
	},
	feedbackViewButton: {
		flexDirection: 'row',
	},
	modalContainer: {
		backgroundColor: 'white',
		borderTopLeftRadius: 25,
		borderTopRightRadius: 25,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		paddingBottom: 20,
	},
	title: {
		textAlign: 'center',
		paddingTop: 10,
		paddingBottom: 10,
		fontSize: 20,
		color: '#EB9156',
	},
	submitButton: {
		marginHorizontal: 90,
		marginBottom: 10,
		elevation: 5,
		borderRadius: 10,
		borderColor: '#379683',
		borderWidth: 2,
		backgroundColor: '#fff',
		alignItems: 'center',
		height: 40,
		justifyContent: 'center',
	},
	submitButtonText: {
		fontSize: 18,
		color: '#EB9156',
	},
	closeButton: {
		alignSelf: 'flex-end',
		right: 5,
		top: 5,
	},
	containerHeader: {
		marginTop: -12,
		marginHorizontal: 10,
		paddingHorizontal: 10,
		backgroundColor: 'white',
		position: 'absolute',
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
	feedbackControllerContainer: {
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
		height: 135,
	},
	textInputContainer: {
		flex: 1,
		paddingHorizontal: 10,
		width: '99%',
	},
	errorMessage: {
		color: 'red',
		paddingBottom: 5,
		paddingLeft: 15,
	},
});

export default FeedBack;
