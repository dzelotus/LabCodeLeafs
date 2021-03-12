import React, { useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import SQLite from 'react-native-sqlite-storage';

const HelpScreen = () => {
	const getData = () => {
		SQLite.openDatabase({
			name: 'a',
			location: 'default',
			createFromLocation: '~www/users.db',
		})
			.then((res) => {
				console.log('SUC', res);

				fetchData(res);
			})
			.catch((err) => {
				console.log('ERR', err);
			});
	};

	const fetchData = (db) => {
		db.transaction((txn) => {
			txn.executeSql('SELECT * FROM users', [], (tx, results) => {
				console.log('len', results.rows.item(0));
			});
		});
	};

	useEffect(() => {
		SQLite.enablePromise(true);
		SQLite.DEBUG(true);
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
			<Button title="DB FETCH" onPress={() => getData()} />
		</View>
	);
};

export default HelpScreen;
