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
import Icon from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HTML from 'react-native-render-html';
import nodeApi from '../api/nodeApi';

const { Conway } = require('@lab-code/moonphase');

const MoonCalendarScreen = (props) => {
	const [date, setDate] = useState();
	const [moon, setMoon] = useState();
	const [showMonthlyData, setShowMonthlyData] = useState(false);
	const [showPhaseDescription, setShowPhaseDescription] = useState(true);
	const [montlyData, setMonthlyData] = useState(null);

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

	const getDate = () => {
		const now = moment();
		const day = now.date();
		const month = now.month() + 1;
		const year = now.year();
		const today = now.locale('ru').format('D MMMM YYYY');

		setDate({ now, day, month, year, today });
		const moonphase = Conway(day, month, year);
		getMoonPhase(moonphase);
		getMonthlyData(month, year);
	};

	const increaseDate = () => {
		const now = date.now.add(1, 'days');
		const day = now.date();
		const month = now.month() + 1;
		const year = now.year();
		const today = now.locale('ru').format('D MMMM YYYY');

		setDate({ ...date, now, day, month, year, today });
		const moonphase = Conway(day, month, year);
		getMoonPhase(moonphase);
		getMonthlyData(month, year);
	};

	const decreaseDate = () => {
		const now = date.now.add(-1, 'days');
		const day = now.date();
		const month = now.month() + 1;
		const year = now.year();
		const today = now.locale('ru').format('D MMMM YYYY');

		setDate({ ...date, now, day, month, year, today });
		const moonphase = Conway(day, month, year);
		getMoonPhase(moonphase);
		getMonthlyData(month, year);
	};
	const getMoonPhase = (moonphase) => {
		nodeApi
			.get(`/garden-calendar/moon-phase-calendar/${moonphase}`)
			.then((response) => {
				console.log('MOON RESP', response.data);
				setMoon(response.data.data);
			})
			.catch(() => /* console.log('MOON ERR', error) */ null);
	};

	const getMonthlyData = (month, year) => {
		console.log('MONTH', month);
		nodeApi
			.get(`/garden-calendar/monthly-calendar/${month}/${year}`)
			.then((response) => {
				console.log('MONTH RESP', response.data);
				setMonthlyData(response.data.data.content);
			})
			.catch((error) => {
				console.log('MOON ERR', error.response);
				setMonthlyData('Нет данных');
			});
	};

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

	console.log('MOON', moon);

	useEffect(() => {
		getDate();

		props.navigation.setOptions({
			headerBackTitle: 'Назад',
		});
	}, []);

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
			<View>
				<Text
					style={{
						fontSize: 20,
						color: '#EB9156',
						textAlign: 'center',
						marginVertical: 10,
					}}
				>
					{date.today}
				</Text>
				<View
					style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
				>
					<TouchableOpacity
						onPress={() => {
							decreaseDate();
						}}
					>
						<Icon name="chevron-thin-left" size={50} color="#EB9156" />
					</TouchableOpacity>
					<FastImage
						style={{ width: 150, height: 150, marginHorizontal: 20 }}
						source={{ uri: moon.phase_image_url }}
					/>

					<TouchableOpacity
						onPress={() => {
							increaseDate();
						}}
					>
						<Icon name="chevron-thin-right" size={50} color="#EB9156" />
					</TouchableOpacity>
				</View>
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
