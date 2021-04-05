import {
	Text,
	View,
	ActivityIndicator,
	TouchableOpacity,
	ScrollView,
	StyleSheet,
	useWindowDimensions,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HTML from 'react-native-render-html';
import SQLite from 'react-native-sqlite-storage';

import MoonPhaseCard from '../components/MoonPhaseCard';

const { Conway } = require('@lab-code/moonphase');

const MoonCalendarScreen = (props) => {
	const [date, setDate] = useState();
	const [moon, setMoon] = useState();
	const [showMonthlyData, setShowMonthlyData] = useState(false);
	const [showPhaseDescription, setShowPhaseDescription] = useState(true);
	const [db, setDb] = useState(null);
	const [montlyData, setMonthlyData] = useState(null);
	const [loading, setLoading] = useState(true);

	moment.updateLocale('ru', {
		months: [
			'Января',
			'Февраля',
			'Марта',
			'Апреля',
			'Мая',
			'Июня',
			'Июля',
			'Августа',
			'Сентября',
			'Октября',
			'Ноября',
			'Декабря',
		],
	});

	useEffect(() => {
		SQLite.enablePromise(true);
		SQLite.DEBUG(true);
		getData();

		if (!loading) {
			const now = moment();
			getDateFunc(now);
		}

		props.navigation.setOptions({
			headerBackTitle: 'Назад',
		});
	}, [loading]);

	const getData = () => {
		SQLite.openDatabase({
			name: 'leafs',
			location: 'default',
			createFromLocation: '~www/leafsDb.db',
		})
			.then((res) => {
				console.log('SUC', res);
				setDb(res);
				setLoading(false);
			})
			.catch((err) => {
				console.log('ERR', err);
			});
	};

	const fetchData = (moonphase) => {
		db.transaction((txn) => {
			txn.executeSql(
				`SELECT * FROM moon WHERE phase_number = ${moonphase}`,
				[],
				(tx, results) => {
					setMoon(results.rows.item(0));
				},
			);
		});
	};

	const getDateFunc = (now) => {
		const day = now.date();
		const month = now.month() + 1;
		const year = now.year();
		const today = now.locale('ru').format('D MMMM YYYY');
		const moonphase = Conway(day, month, year);

		setDate({ now, day, month, year, today, moonphase });

		fetchData(moonphase);

		getMonthlyData(month, year);
	};

	const getMonthlyData = (month, year) => {
		db.transaction((txn) => {
			txn.executeSql(
				`SELECT * FROM monthly_calendar WHERE month_number = ${month} AND year_number = ${year}`,
				[],
				(tx, results) => {
					console.log('tx', tx);
					console.log('len', results.rows.item(0));
					const res = results.rows.item(0);
					console.log('RES', res.content);
					setMonthlyData(res.content);
				},
			);
		});
	};

	/* const getMonthlyData = (month, year) => {
		nodeApi
			.get(`/garden-calendar/monthly-calendar/${month}/${year}`)
			.then((response) => {
				console.log(response.data.data.content);
				if (montlyData !== response.data.data.content) {
					setMonthlyData(response.data.data.content);
				}
			})
			.catch((error) => {
				console.log('MOON ERR', error.response);
				setMonthlyData('Нет данных');
			});
	}; */

	const MonthlyCalendar = () => {
		const contentWidth = useWindowDimensions().width;
		const computeEmbeddedMaxWidth = (availableWidth) => {
			return Math.min(availableWidth, 500);
		};
		return (
			<HTML
				containerStyle={{ marginVertical: 15 }}
				source={{ html: montlyData }}
				tagsStyles={{
					div: { flex: 1, fontSize: 16, borderWidth: 0.3 },
					p: { fontSize: 16, paddingBottom: 15 },
					i: { fontSize: 16, fontWeight: 'bold' },
				}}
				contentWidth={contentWidth}
				computeEmbeddedMaxWidth={computeEmbeddedMaxWidth}
				ignoredStyles={['width']}
			/>
		);
	};

	const Indicator = () => (
		<View
			style={{
				backgroundColor: 'white',
				flex: 1,
			}}
		>
			<ActivityIndicator size="large" color="#379683" style={{ flex: 1 }} />
		</View>
	);

	if (!moon) {
		return <Indicator />;
	}
	return (
		<ScrollView
			style={{
				paddingHorizontal: 10,
				paddingTop: 10,
				paddingBottom: 5,
				backgroundColor: 'white',
				flex: 1,
			}}
		>
			<MoonPhaseCard getDateFunc={(now) => getDateFunc(now)} date={date} />
			<Text
				style={{
					textAlign: 'center',
					fontSize: 20,
					marginVertical: 10,
					color: '#EB9156',
				}}
			>
				{moon.phase_name}
			</Text>
			<View style={styles.additionalInfo}>
				<TouchableOpacity
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						margin: 10,
					}}
					onPress={() => {
						setShowPhaseDescription(!showPhaseDescription);
					}}
				>
					<Text style={{ fontSize: 18 }}>Описание фазы</Text>
					<FontAwesome
						name={showPhaseDescription ? 'chevron-up' : 'chevron-down'}
						size={20}
						color="#379683"
						style={{ paddingLeft: 10 }}
					/>
				</TouchableOpacity>
				{showPhaseDescription ? (
					<Text
						style={{
							fontSize: 18,
							color: '#379683',
							textAlign: 'center',
							marginVertical: 10,
						}}
					>
						{moon.phase_description}
					</Text>
				) : null}
			</View>
			<View style={styles.additionalInfo}>
				<TouchableOpacity
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						margin: 10,
					}}
					onPress={() => {
						setShowMonthlyData(!showMonthlyData);
					}}
				>
					<Text style={{ fontSize: 18 }}>Месячный календарь</Text>
					<FontAwesome
						name={showMonthlyData ? 'chevron-up' : 'chevron-down'}
						size={20}
						color="#379683"
						style={{ paddingLeft: 10 }}
					/>
				</TouchableOpacity>
				{showMonthlyData ? <MonthlyCalendar /> : null}
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	additionalInfo: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		borderRadius: 10,
		borderColor: '#379683',
		borderWidth: 1,
		backgroundColor: '#fff',
		padding: 5,

		marginTop: 10,
		marginBottom: 10,
	},
});

export default MoonCalendarScreen;
