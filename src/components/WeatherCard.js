import 'moment/locale/ru';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import React from 'react';
import moment from 'moment';
import { withNavigation } from '@react-navigation/compat';
import FastImage from 'react-native-fast-image';

const LastScansCard = ({ weatherInfo }) => {
	console.log('WEATHER CARD', weatherInfo);
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
	const now = moment().locale('ru').format('D MMMM');

	return (
		<View style={styles.containerStyle}>
			<View
				style={{
					flexDirection: 'row',
					marginTop: 5,
					alignSelf: 'center',
				}}
			>
				<Text style={{ fontSize: 18, color: '#379683' }}>{weatherInfo.location},</Text>
				<Text style={{ fontSize: 18, marginLeft: 5, color: '#379683' }}>{now}</Text>
			</View>
			<View style={styles.rowStyle}>
				<View
					style={{
						alignContent: 'flex-end',
						justifyContent: 'center',
						flex: 1,
						marginLeft: 10,
						borderColor: 'red',
						borderWidth: 2,
					}}
				>
					<View style={{ flexDirection: 'row' }}>
						<View>
							<FastImage
								style={styles.image}
								source={{
									uri: `http://openweathermap.org/img/wn/${weatherInfo.icon}@2x.png`,
								}}
							/>
						</View>
						<View
							style={{
								flexDirection: 'row',
								alignSelf: 'flex-start',
							}}
						>
							<Text
								style={{
									textAlignVertical: 'center',
									fontSize: 40,
									color: '#EB9156',
								}}
							>
								{Number.parseInt(weatherInfo.temp, 10)}
							</Text>
							<Icon
								name="circle-o"
								size={12}
								style={{ marginTop: 7 }}
								color="#EB9156"
							/>
							<Text
								style={{
									textAlignVertical: 'center',
									fontSize: 40,
									color: '#EB9156',
								}}
							>
								С
							</Text>
						</View>
					</View>
					<View
						style={{
							alignSelf: 'flex-start',
						}}
					>
						<Text style={{ marginBottom: 5, color: '#379683', fontSize: 16 }}>
							{weatherInfo.description}
						</Text>
					</View>
				</View>
				<View style={{ borderColor: 'green', borderWidth: 2, flex: 1 }}>
					<Text>Moon Calendar</Text>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	containerStyle: {
		marginHorizontal: 5,
		marginBottom: 15,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,

		elevation: 5,
		borderRadius: 10,
		borderColor: '#000',
		backgroundColor: '#fff',
	},

	cardStyle: {
		paddingTop: 10,
		paddingHorizontal: 10,
	},
	cardHeaderText: {
		textAlignVertical: 'center',
		marginLeft: 20,
		fontSize: 20,
		color: '#379683',
	},
	cardItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingRight: 10,
	},
	lastCardItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingBottom: 10,
		marginRight: 10,
	},
	textItem: {
		flex: 1,
		color: '#EB9156',
		fontSize: 15,
	},

	image: {
		width: 60,
		height: 60,
		borderColor: 'blue',
		borderWidth: 2,
	},

	rowStyle: {
		flexDirection: 'row',
	},
});

export default withNavigation(LastScansCard);
