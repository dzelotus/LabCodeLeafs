// *** NPM ***
import React, { useState, useEffect, useCallback } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	ActivityIndicator,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';

// *** OTHER ***
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
			// TODO: WHAT IF ERROR --> TILL NOW WE JUST CLOSE MODAL
			onClose();
			console.log(error);
		}
	}, [onClose]);

	const fetchCreateFeedbackGeneral = async (feedbackData) => {
		try {
			await axios.post('/feedback/general', {
				...feedbackData,
				_csrf: csrfState,
			});

			// successfully performed
			onPerform();
		} catch (error) {
			// TODO: WHAT IF ERROR --> TILL NOW WE JUST CLOSE MODAL
			onClose();
			console.log(error);
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

	return (
		<View style={styles.titleView}>
			{/* TITLE */}
			<Text style={styles.title}>Оставить отзыв</Text>

			{/* INPUTS */}
			<View style={styles.inputsView}>
				{/* NAME */}
				<View style={styles.input}>
					<Controller
						control={control}
						render={({ onChange, value }) => (
							<TextInput
								placeholder="Ваше имя"
								onChangeText={(newValue) => onChange(newValue)}
								value={value}
							/>
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
					<Text style={{ color: 'red', marginTop: -10, marginBottom: 10 }}>
						{errors.name?.message}
					</Text>
				)}

				{/* EMAIL */}
				<View style={styles.input}>
					<Controller
						control={control}
						render={({ onChange, value }) => (
							<TextInput
								placeholder="Ваш e-mail (электронная почта)"
								onChangeText={(newValue) => onChange(newValue)}
								value={value}
							/>
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
					<Text style={{ color: 'red', marginTop: -10, marginBottom: 10 }}>
						{errors.email.message}
					</Text>
				)}

				{/* MESSAGE */}
				<View style={styles.feedbackInput}>
					<Controller
						control={control}
						render={({ onChange, value }) => (
							<TextInput
								placeholder="Ваш отзыв"
								onChangeText={(newValue) => onChange(newValue)}
								value={value}
								multiline
								numberOfLines={10}
							/>
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
					<Text style={{ color: 'red', marginTop: -10, marginBottom: 10 }}>
						{errors.message?.message}
					</Text>
				)}
			</View>

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
			<TouchableOpacity style={styles.closeButton} onPress={onClose}>
				<Icon name="close" size={25} color="#379683" />
			</TouchableOpacity>
		</View>
	);
};

const FeedBack = () => {
	// *** USE STATE ***
	const [modalVisibleState, setModalVisibleState] = useState(false);

	// *** HANDLERS ***
	const onPress = () => setModalVisibleState(() => !modalVisibleState);

	return (
		<>
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
			>
				<FeedbackGeneralNew
					onClose={() => setModalVisibleState(() => false)}
					onPerform={() => setModalVisibleState(() => false)}
				/>
			</Modal>
		</>
	);
};

// *** STYLES ***
const styles = StyleSheet.create({
	feedbackView: {
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
	feedbackViewButton: {
		flexDirection: 'row',
	},
	titleView: {
		marginHorizontal: 5,
		marginBottom: 10,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		borderRadius: 5,
		borderColor: '#000',
		backgroundColor: '#fff',
	},
	title: {
		marginTop: 15,
		textAlign: 'center',
		fontSize: 20,
		color: '#EB9156',
	},
	inputsView: {
		paddingVertical: 100,
		paddingTop: 0,
		paddingBottom: 0,
		marginHorizontal: 40,
		marginTop: 10,
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 0,
		justifyContent: 'center',
	},
	input: {
		borderRadius: 4,
		borderColor: '#696969',
		borderWidth: 1,
		marginBottom: 10,
		height: 50,
	},
	feedbackInput: {
		borderRadius: 4,
		borderColor: '#696969',
		borderWidth: 1,
		marginBottom: 10,
		height: 150,
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
		position: 'absolute',
		top: 10,
		right: 15,
	},
});

export default FeedBack;
