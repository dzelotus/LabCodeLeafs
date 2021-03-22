import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
	View,
	TouchableOpacity,
	Text,
	TextInput,
	Image,
	ActivityIndicator,
	ScrollView,
	Alert,
	StyleSheet,
} from 'react-native';
import { Button } from 'react-native-elements';
import { inputChange, getProfileInfo, updateProfileInfo } from '../actions/EditProfileActions';

const EditProfileScreen = (props) => {
	console.log('THIS IS PROPS', props);

	const onButtonPress = () => {
		const { name, surname } = props;

		props.updateProfileInfo({ name, surname });
	};

	const { screenLoading, photo, name, surname } = props;

	useEffect(() => {
		props.getProfileInfo();
		props.navigation.setOptions({
			headerTruncatedBackTitle: 'Назад',
		});
	}, []);

	const activeButton = () => {
		if (props.loading === true) {
			return <ActivityIndicator size="large" />;
		}
		return (
			<Button
				style={{ marginHorizontal: 60 }}
				title="Сохранить"
				onPress={() => onButtonPress()}
				containerStyle={{ marginHorizontal: 60 }}
				buttonStyle={{ backgroundColor: '#116B58' }}
			/>
		);
	};

	if (screenLoading) {
		return <ActivityIndicator size="large" color="#379683" />;
	}
	return (
		<View>
			<ScrollView keyboardShouldPersistTaps="always">
				<TouchableOpacity
					style={{ marginBottom: 10 }}
					onPress={() => {
						Alert.alert('Ошибка', 'функция пока недоступна');
					}}
				>
					<Image
						style={{
							borderColor: 'green',
							borderWidth: 1,
							borderRadius: 75,
							height: 120,
							width: 120,
							alignSelf: 'center',
							marginTop: 15,
							marginBottom: 10,
						}}
						source={{
							uri: photo,
						}}
					/>
					<Text
						style={{
							textAlign: 'center',
							fontSize: 15,
							fontWeight: 'bold',
							backgroundColor: '#116B58',
							marginHorizontal: 60,
							color: '#FFFFFF',
							height: 35,
							borderRadius: 5,
							textAlignVertical: 'center',
						}}
					>
						Изменить фото
					</Text>
				</TouchableOpacity>
				<View style={styles.inputContainer}>
					<Text style={styles.inputLabel}>Имя</Text>
					<TextInput
						value={name}
						onChangeText={(text) => {
							props.inputChange({
								prop: 'name',
								value: text,
							});
						}}
					/>
				</View>
				<View style={styles.inputContainer}>
					<Text style={styles.inputLabel}>Фамилия</Text>
					<TextInput
						value={surname}
						onChangeText={(text) => {
							props.inputChange({
								prop: 'surname',
								value: text,
							});
						}}
					/>
				</View>
				<View style={{ marginTop: 20 }}>{activeButton()}</View>
			</ScrollView>
		</View>
	);
};

const mapStateToProps = ({ profile }) => {
	const { name, surname, location, photo, data, _csrf, loading } = profile;

	return { name, surname, location, photo, data, _csrf, loading };
};

const styles = StyleSheet.create({
	inputLabel: {
		fontSize: 15,
		color: '#116B58',
	},
	inputContainer: {
		marginHorizontal: 40,
		marginTop: 20,
		borderBottomColor: '#379683',
		borderBottomWidth: 1,
	},
	focusedInput: {
		backgroundColor: '#D3D3D3',
	},
	inputInput: {
		paddingRight: 'auto',
	},
});

export default connect(mapStateToProps, {
	inputChange,
	getProfileInfo,
	updateProfileInfo,
})(EditProfileScreen);
