import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
/* import SQLite from 'react-native-sqlite-storage'; */
import { Q } from '@nozbe/watermelondb';
import { database } from '../model/database';

const HelpScreen = () => {
	/* const getData = () => {
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
	}, []); */

	const [post, setPost] = useState(null);

	const postsDb = database.collections.get('posts');

	const savePost = async () => {
		await database.action(async () => {
			await postsDb.create((entry) => {
				entry.title = 'TITLE1';
				entry.body = 'BODY1';
			});
		});
	};

	const allPosts = async () => {
		await postsDb
			.query(Q.where('title', Q.eq('TITLE1')))
			.fetch()
			.then((res) => {
				console.log('RES', res[0]._raw);
				setPost(res[0]._raw);
			})
			.catch((err) => console.log('ERR', err));
	};

	const Post = () => {
		if (post) {
			return (
				<View>
					<Text>{post.body}</Text>
				</View>
			);
		}
		return null;
	};

	return (
		<View>
			<Text>Экран помощи</Text>
			<Text>В разработке</Text>
			{/* <Button
				title="Убрать токен первого запуска"
				onPress={() =>
					AsyncStorage.removeItem('alreadyLaunched').then(() => Alert.alert('Убрано'))
				}
			/>
			<Button title="DB FETCH" onPress={() => allPosts()} />
			<Button title="DB ADD" onPress={() => savePost()} />
			<Post /> */}
		</View>
	);
};

export default HelpScreen;
