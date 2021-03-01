import React from 'react';
/* import { View, Text } from 'react-native'; */
import { View, Text, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const HelpScreen = () => {
	return (
		<View>
			<Text>Экран помощи</Text>
			<Text>В разработке</Text>
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
