import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
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

export default db;
