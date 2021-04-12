import React from 'react';
import { View, Text, Button } from 'react-native';
import { Q } from '@nozbe/watermelondb';
import { database } from '../model/database';

const LocalCatalog = ({ data }) => {
	const postsDb = database.collections.get('catalog');
	console.log(postsDb.database.collections.map.catalog);

	/* 	const mappedData = () => {
		data.map((item) => {
			savePost(item.name);
			return item.name;
		});
	};

	const savePost = async (name) => {
		console.log(name);
		await database.action(async () => {
			await postsDb.create((entry) => {
				entry.name = name;
			});
		});
	};
 */
	/* const allPosts = async () => {
		await postsDb
			.query(Q.where('title', Q.eq('TITLE1')))
			.fetch()
			.then((res) => {
				console.log('RES', res[0]._raw);
				setPost(res[0]._raw);
			})
			.catch((err) => console.log('ERR', err));
	}; */

	return (
		<View>
			<Text>Local</Text>
			<Button title="Записать в базу" /* onPress={() => mappedData()}  */ />
			<Button title="Логнуть из базы" />
		</View>
	);
};

export default LocalCatalog;
