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
	}, []);

	const activeButton = () => {
		if (props.loading === true) {
			return <ActivityIndicator size="large" />;
		}
		return (
			<Button
				style={{ marginHorizontal: 15 }}
				title="Обновить профиль"
				onPress={() => onButtonPress()}
				containerStyle={{ paddingHorizontal: 10 }}
				buttonStyle={{ backgroundColor: '#8DC34A' }}
			/>
		);
	};

	if (screenLoading) {
		return <ActivityIndicator size="large" color="#8DC34A" />;
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
						}}
					>
						Сменить фото профиля
					</Text>
				</TouchableOpacity>
				<View
					style={{
						marginHorizontal: 10,
						borderBottomColor: '#8DC34A',
						borderBottomWidth: 1,
					}}
				>
					<Text>Имя</Text>
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
				<View
					style={{
						marginHorizontal: 10,
						borderBottomColor: '#8DC34A',
						borderBottomWidth: 1,
					}}
				>
					<Text>Фамилия</Text>
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

export default connect(mapStateToProps, {
	inputChange,
	getProfileInfo,
	updateProfileInfo,
})(EditProfileScreen);
