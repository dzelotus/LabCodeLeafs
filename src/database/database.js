import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
	{
		name: 'leafs',
		location: 'default',
		createFromLocation: '~www/leafsDb.db',
	},
	(suc) => {
		console.log('DB OPENED', suc);
	},
	() => {
		console.log('ERROR');
	},
);

export default db;
