import React from 'react';
import { View, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Button } from 'react-native-elements';

const HelpScreen = () => {
	return (
		<View>
			<Text>Экран помощи</Text>
			<Button
				title="Убрать токен первого запуска"
				onPress={() =>
					AsyncStorage.removeItem('alreadyLaunched').then(() => Alert.alert('Убрано'))
				}
			/>
		</View>
	);
};

export default HelpScreen;
