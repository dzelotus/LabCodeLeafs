import React, { useEffect } from 'react';
/* import { View, Text } from 'react-native'; */
import { View, Text, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import SQLite from 'react-native-sqlite-storage';

const HelpScreen = () => {
	const db = SQLite.openDatabase({ name: 'testDB.db', location: 'default' });

	const successToOpenDb = () => {
		alert('success');
	};

	const failToOpenDb = (err) => {
		console.log(err);
	};

	const openDB = () => {
		SQLite.openDatabase({
			name: 'testDB.db',
			location: 'default',
		});
		successToOpenDb(), failToOpenDb(err);
	};

	const getData = () => {
		db.transaction((tx) => {
			tx.executeSql('SELECT * FROM test_table', [], (tx, results) => {
				console.log('len', results);
			});
		});
	};

	useEffect(() => {
		getData();
	}, []);

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
