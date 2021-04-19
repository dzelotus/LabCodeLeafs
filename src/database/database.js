/* eslint-disable import/prefer-default-export */
import SQLite from 'react-native-sqlite-storage';

export const db = SQLite.openDatabase(
	{
		name: 'leafs',
		location: 'default',
		createFromLocation: '~www/leafsDb.db',
	},
	() => {
		console.log('DB OPENED');
	},
	() => {
		console.log('ERROR');
	},
);
