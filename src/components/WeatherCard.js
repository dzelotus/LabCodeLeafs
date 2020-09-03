import 'moment/locale/ru';

import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/FontAwesome';
import React from 'react';
import moment from 'moment';
import { withNavigation } from '@react-navigation/compat';

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
	let now = moment().locale('ru').format('D MMMM');

	console.log(now);

	return (
		<View style={styles.containerStyle}>
			<View style={styles.rowStyle}>
				<View>
					<Image
						style={styles.image}
						source={{
							uri: `http://openweathermap.org/img/wn/${weatherInfo.icon}@2x.png`,
						}}
					/>
				</View>

				<View
					style={{
						alignContent: 'flex-end',
						justifyContent: 'center',
						flex: 1,
					}}>
					<View
						style={{
							flexDirection: 'row',
							marginTop: 5,
						}}>
						<Text style={{ fontSize: 15, color: '#8DC34A' }}>
							{weatherInfo.location},
						</Text>
						<Text style={{ fontSize: 15, marginLeft: 5, color: '#8DC34A' }}>{now}</Text>
					</View>
					<View
						style={{
							alignSelf: 'center',
							flexDirection: 'row',
							alignSelf: 'flex-start',
						}}>
						<Text
							style={{
								textAlignVertical: 'center',
								fontSize: 40,
								color: '#FF9800',
							}}>
							{weatherInfo.temp}
						</Text>
						<Icon
							name="circle-o"
							size={12}
							style={{ marginTop: 7 }}
							color={'#FF9800'}
						/>
						<Text
							style={{
								textAlignVertical: 'center',
								fontSize: 40,
								color: '#FF9800',
							}}>
							С
						</Text>
					</View>
					<View
						style={{
							alignSelf: 'flex-start',
						}}>
						<Text style={{ marginBottom: 5, color: '#8DC34A' }}>
							{weatherInfo.description}
						</Text>
					</View>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	containerStyle: {
		marginHorizontal: 15,
		marginBottom: 15,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 12,
		},
		shadowOpacity: 0.58,
		shadowRadius: 16.0,
		elevation: 3,
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
		color: '#8DC34A',
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
		color: '#FF9800',
		fontSize: 15,
	},

	image: {
		width: 100,
		height: 100,
	},

	rowStyle: {
		flexDirection: 'row',
	},
});

export default withNavigation(LastScansCard);
