/* eslint-disable import/prefer-default-export */
import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import schema from './schema';
import Post from './Post';
import Catalog from './Catalog';

const adapter = new SQLiteAdapter({
	dbName: 'WatermelonDB',
	schema,
});

// Then, make a Watermelon database from it!
export const database = new Database({
	adapter,
	modelClasses: [
		Post, // Post, // ⬅️ You'll add Models to Watermelon here
		Catalog,
	],
	actionsEnabled: true,
});
