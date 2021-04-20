import { isEqual, differenceWith } from 'lodash';
import nodeApi from '../api/nodeApi';
import { db } from './database';

export const populateLocalTables = async (table) => {
	console.log('FUNC TABLE', table);
	try {
		await db.transaction((txn) => {
			txn.executeSql(
				`CREATE TABLE IF NOT EXISTS ${table} (id bigin NOT NULL PRIMARY KEY, name int NOT NULL, content int NOT NULL, ai_name character varying)`,
				[],
				(tx, results) => {
					console.log('SUCCESS', results);
				},
				(error) => {
					console.log('BIG FUCKING ERROR', error);
				},
			);
		});

		let dbData;
		await db.transaction((txn) => {
			txn.executeSql(
				`SELECT CAST(id as TEXT) as id, ai_name, content, name FROM ${table} `,
				[],
				(tx, results) => {
					if (results.rows.length > 0) {
						const res = results.rows;
						const resArr = [];
						for (let i = 0; i < res.length; i += 1) {
							resArr.push(res.item(i));
						}
						dbData = resArr;
					} else {
						dbData = false;
					}
				},
				() => {
					console.log('ERROR BASE ERROR FUCKING ERROR');
				},
			);
		});
		const serverData = await nodeApi
			.get(`/plant-protection/${table}`)
			.then((response) => {
				return response.data.data;
			})
			.catch((error) => {
				console.log('ERROR', error.response);
			});

		console.log('LOCAL', dbData[0]);
		console.log('SERVER', serverData[0]);

		const serverDifference = differenceWith(serverData, dbData, isEqual);
		const localDbDifference = differenceWith(dbData, serverData, isEqual);
		console.log('DIFF', serverDifference, localDbDifference);

		if (!dbData) {
			console.log('NO DB DATA');
			serverData.map((item) => {
				const { name, content, id } = item;
				const aiName = item.ai_name;
				db.transaction((txn) => {
					txn.executeSql(
						`INSERT INTO ${table} (id, name, content, ai_name) VALUES (${id}, '${name}', '${content}', '${aiName}')`,
						[],
						() => {},
						(error) => {
							console.log('BIG FUCKING ERROR', error);
						},
					);
				});
				return item;
			});
		} else if (serverDifference) {
			console.log('HAS DB DATA');
			serverDifference.map((item) => {
				const { name, content, id } = item;
				const aiName = item.ai_name;
				db.transaction((txn) => {
					txn.executeSql(
						`REPLACE INTO ${table} (id, name, content, ai_name) VALUES (${id}, '${name}', '${content}', '${aiName}')`,
						[],
						() => {},
						(error) => {
							console.log('BIG FUCKING ERROR', error);
						},
					);
				});
				return item;
			});

			localDbDifference.map((item) => {
				const { id } = item;

				db.transaction((txn) => {
					txn.executeSql(
						`DELETE FROM ${table} WHERE id = ${id}`,
						[],
						() => {},
						(error) => {
							console.log('BIG FUCKING ERROR', error);
						},
					);
				});
				return item;
			});
		}
	} catch (error) {
		console.log('ERROR', error);
	}
};

export const populateLocalHealTable = async (table) => {
	console.log('FUNC TABLE', table);
	try {
		await db.transaction((txn) => {
			txn.executeSql(
				`CREATE TABLE IF NOT EXISTS ${table} (id bigint NOT NULL PRIMARY KEY, name int NOT NULL, content int NOT NULL)`,
				[],
				(tx, results) => {
					console.log('SUCCESS', results);
				},
				(error) => {
					console.log('BIG FUCKING ERROR', error);
				},
			);
		});

		let dbData;
		await db.transaction((txn) => {
			txn.executeSql(
				`SELECT CAST(id as TEXT) as id, content, name FROM ${table} `,
				[],
				(tx, results) => {
					if (results.rows.length > 0) {
						const res = results.rows;
						const resArr = [];
						for (let i = 0; i < res.length; i += 1) {
							resArr.push(res.item(i));
						}
						dbData = resArr;
					} else {
						dbData = false;
					}
				},
				() => {
					console.log('ERROR BASE ERROR FUCKING ERROR');
				},
			);
		});
		const serverData = await nodeApi
			.get(`/plant-protection/${table}`)
			.then((response) => {
				console.log('HEAL RESP', response.data.data[0]);
				return response.data.data;
			})
			.catch((error) => {
				console.log('ERROR', error.response);
			});

		console.log('LOCAL', dbData[0]);
		console.log('SERVER', serverData[0]);

		const serverDifference = differenceWith(serverData, dbData, isEqual);
		const localDbDifference = differenceWith(dbData, serverData, isEqual);
		console.log('DIFF', serverDifference, localDbDifference);

		if (!dbData) {
			console.log('NO DB DATA');
			serverData.map((item) => {
				const { name, content, id } = item;
				db.transaction((txn) => {
					txn.executeSql(
						`INSERT INTO ${table} (id, name, content) VALUES (${id}, '${name}', '${content}')`,
						[],
						() => {},
						(error) => {
							console.log('BIG FUCKING ERROR', error);
						},
					);
				});
				return item;
			});
		} else if (serverDifference) {
			console.log('HAS DB DATA');
			serverDifference.map((item) => {
				const { name, content, id } = item;
				db.transaction((txn) => {
					txn.executeSql(
						`REPLACE INTO ${table} (id, name, content) VALUES (${id}, '${name}', '${content}')`,
						[],
						() => {},
						(error) => {
							console.log('BIG FUCKING ERROR', error);
						},
					);
				});
				return item;
			});

			localDbDifference.map((item) => {
				const { id } = item;
				db.transaction((txn) => {
					txn.executeSql(
						`DELETE FROM ${table} WHERE id = ${id}`,
						[],
						() => {},
						(error) => {
							console.log('BIG FUCKING ERROR', error);
						},
					);
				});
				return item;
			});
		}
	} catch (error) {
		console.log('ERROR', error);
	}
};
