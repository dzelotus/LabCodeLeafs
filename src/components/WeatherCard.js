/* eslint-disable global-require */
/* eslint-disable no-nested-ternary */

/* Виджет погоды и лунного календаря */

// ***NPM***
import 'moment/locale/ru';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import React from 'react';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';

// ***OTHER***
import { resolveAuth, refreshConnection } from '../actions/AuthActions';
import imageSwitch from '../assets/weatherIcon';
import moonImageSwitch from '../assets/moonIcon';
import Indicator from './Indicator';

const WeatherCard = (props) => {
	const {
		moonInfo,
		weatherInfo,
		getLocation,
		weatherLoading,
		resolveAuth,
		isSigned,
		checkInternet,
	} = props;

	const navigation = useNavigation();

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
			<View>
				{/* WEATHER */}
				{weatherLoading ? (
					<View style={{ height: 75 }}>
						<Indicator
							style={{
								backgroundColor: 'white',
								flex: 1,
							}}
						/>
					</View>
				) : weatherInfo && checkInternet ? (
					<View>
						<View
							style={{
								flexDirection: 'row',
								marginVertical: 10,
								alignSelf: 'center',
							}}
						>
							<Text style={{ fontSize: 18, color: '#379683' }}>
								{weatherInfo.location},
							</Text>
							<Text style={{ fontSize: 18, marginLeft: 5, color: '#379683' }}>
								{now}
							</Text>
						</View>
						<TouchableOpacity
							style={{
								alignContent: 'flex-end',
								justifyContent: 'center',
								flex: 1,
								borderBottomColor: '#379683',
								borderBottomWidth: 2,
								marginHorizontal: 10,
								paddingVertical: 5,
							}}
							onPress={() =>
								navigation.navigate('WeatherScreen', { coords: weatherInfo.coords })
							}
						>
							<View style={{ flexDirection: 'row' }}>
								<View>
									<Image
										style={styles.image}
										source={imageSwitch(weatherInfo.icon)}
										resizeMode="contain"
										resizeMethod="resize"
									/>
								</View>
								<View style={{ marginLeft: 15 }}>
									<View
										style={{
											flexDirection: 'row',
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
									<View
										style={{
											alignSelf: 'center',
										}}
									>
										<Text
											style={{
												marginVertical: 10,
												color: '#379683',
												fontSize: 18,
											}}
										>
											{weatherInfo.description}
										</Text>
									</View>
								</View>
							</View>
						</TouchableOpacity>
					</View>
				) : checkInternet ? (
					<TouchableOpacity
						style={{
							height: 75,
							justifyContent: 'center',
							borderBottomColor: '#379683',
							borderBottomWidth: 2,
							marginHorizontal: 10,
						}}
						onPress={() => getLocation()}
					>
						<Text style={{ textAlign: 'center', fontSize: 18, color: '#EB9156' }}>
							Прогноз погоды доступен только при предоставлении доступа к определению
							местоположения
						</Text>
					</TouchableOpacity>
				) : null}
				{/* MOONPHASE */}
				{moonInfo ? (
					<TouchableOpacity
						style={{
							alignContent: 'flex-end',
							justifyContent: 'center',
							marginHorizontal: 10,
							paddingVertical: 10,
						}}
						onPress={() => navigation.navigate('MoonCalendar')}
					>
						<View style={{ flexDirection: 'row' }}>
							<View>
								<FastImage
									style={styles.image}
									source={moonImageSwitch(moonInfo.phase_number.toString())}
								/>
							</View>
							<View
								style={{
									flex: 1,
									marginLeft: 15,

									justifyContent: 'center',
								}}
							>
								<Text
									style={{
										marginVertical: 10,
										color: '#379683',
										fontSize: 20,
										textAlignVertical: 'center',
									}}
								>
									{moonInfo.phase_name}
								</Text>
							</View>
						</View>
					</TouchableOpacity>
				) : !isSigned ? (
					<TouchableOpacity
						style={{
							height: 75,
							justifyContent: 'center',
						}}
						onPress={() => {
							resolveAuth({ prop: 'toAuthFlow', value: true });
							resolveAuth({ prop: 'toSignupScreen', value: false });
						}}
					>
						<Text style={{ textAlign: 'center', fontSize: 18, color: '#EB9156' }}>
							Лунный календарь доступен только авторизированным пользователям
						</Text>
					</TouchableOpacity>
				) : (
					<Indicator
						style={{
							backgroundColor: 'white',
							flex: 1,
						}}
					/>
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	containerStyle: {
		marginHorizontal: 5,
		marginVertical: 15,
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
		width: 80,
		height: 80,
	},

	rowStyle: {
		flexDirection: 'row',
	},
});

const mapStateToProps = ({ auth }) => {
	const { fistLaunchToken, isSigned, toSignupScreen, toAuthFlow, checkInternet } = auth;

	return { fistLaunchToken, isSigned, toSignupScreen, toAuthFlow, checkInternet };
};

export default connect(mapStateToProps, { resolveAuth, refreshConnection })(WeatherCard);
