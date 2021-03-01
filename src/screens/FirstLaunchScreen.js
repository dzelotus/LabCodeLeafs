/* eslint-disable global-require */
/* eslint-disable no-unused-expressions */
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Image, Platform } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RNBootSplash from 'react-native-bootsplash';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ViewPager from '@react-native-community/viewpager';
import { connect } from 'react-redux';
import { resolveAuth } from '../actions/AuthActions';

const FirstLaunchScreen = (props) => {
	const viewPager = useRef(<ViewPager />);
	const [page, setPage] = useState();

	useEffect(() => {
		RNBootSplash.hide();
	});

	let page1 = 'circle';
	page === 0 ? (page1 = 'circle') : (page1 = 'circle-o');

	let page2 = 'circle';
	page === 1 ? (page2 = 'circle') : (page2 = 'circle-o');

	let page3 = 'circle';
	page === 2 ? (page3 = 'circle') : (page3 = 'circle-o');

	let page4 = 'circle';
	page === 3 ? (page4 = 'circle') : (page4 = 'circle-o');

	let page5 = 'circle';
	page === 4 ? (page5 = 'circle') : (page5 = 'circle-o');

	const padding = Platform.OS === 'ios' ? 50 : 20;

	return (
		<>
			<ViewPager
				ref={viewPager}
				style={styles.viewPager}
				initialPage={0}
				onPageSelected={(e) => {
					setPage(e.nativeEvent.position);
					console.log(e.nativeEvent);
				}}
			>
				<View key="1" style={styles.textContainer}>
					<View
						style={{
							position: 'absolute',
							right: 20,
							top: padding,
						}}
					>
						<TouchableOpacity
							onPress={() => {
								viewPager.current.setPage(1);
							}}
						>
							<Text style={{ fontSize: 20, color: '#379683' }}>Далее</Text>
						</TouchableOpacity>
					</View>
					<Image
						source={require('../../assets/firstLaunchScreenImages/position1.png')}
						style={{ width: 200, height: 200, marginBottom: 15 }}
					/>
					<Image
						source={require('../../assets/firstLaunchScreenImages/bitmap.png')}
						style={{ width: 350, height: 60, marginBottom: 15 }}
						resizeMode="contain"
					/>
					<Text style={{ fontSize: 20, textAlign: 'center' }}>
						Приложение для каждого садовода
					</Text>
				</View>
				<View key="2" style={styles.textContainer}>
					<View
						style={{
							position: 'absolute',
							right: 20,
							top: padding,
						}}
					>
						<TouchableOpacity
							onPress={() => {
								viewPager.current.setPage(2);
							}}
						>
							<Text style={{ fontSize: 20, color: '#379683' }}>Далее</Text>
						</TouchableOpacity>
					</View>
					<Image
						source={require('../../assets/firstLaunchScreenImages/position2.png')}
						style={{ width: 250, height: 250, marginBottom: 15 }}
					/>
					<Image
						source={require('../../assets/firstLaunchScreenImages/bitmap.png')}
						style={{ width: 350, height: 60, marginBottom: 15 }}
						resizeMode="contain"
					/>
					<Text style={{ fontSize: 20, textAlign: 'center' }}>
						Мгновенное определение растений и заболеваний
					</Text>
				</View>
				<View key="3" style={styles.textContainer}>
					<View
						style={{
							position: 'absolute',
							right: 20,
							top: padding,
						}}
					>
						<TouchableOpacity
							onPress={() => {
								viewPager.current.setPage(3);
							}}
						>
							<Text style={{ fontSize: 20, color: '#379683' }}>Далее</Text>
						</TouchableOpacity>
					</View>
					<Image
						source={require('../../assets/firstLaunchScreenImages/position3.png')}
						style={{ width: 250, height: 250, marginBottom: 15 }}
					/>
					<Image
						source={require('../../assets/firstLaunchScreenImages/bitmap.png')}
						style={{ width: 350, height: 60, marginBottom: 15 }}
						resizeMode="contain"
					/>
					<Text style={{ fontSize: 20, textAlign: 'center' }}>
						Удобный и функциональный дневник садовода
					</Text>
				</View>
				<View key="4" style={styles.textContainer}>
					<View
						style={{
							position: 'absolute',
							right: 20,
							top: padding,
						}}
					>
						<TouchableOpacity
							onPress={() => {
								viewPager.current.setPage(4);
							}}
						>
							<Text style={{ fontSize: 20, color: '#379683' }}>Далее</Text>
						</TouchableOpacity>
					</View>
					<Image
						source={require('../../assets/firstLaunchScreenImages/position4.png')}
						style={{ width: 250, height: 250, marginBottom: 15 }}
					/>
					<Image
						source={require('../../assets/firstLaunchScreenImages/bitmap.png')}
						style={{ width: 350, height: 60, marginBottom: 15 }}
						resizeMode="contain"
					/>
					<Text style={{ fontSize: 20, textAlign: 'center' }}>
						Личный доктор Ваших растений
					</Text>
				</View>
				<View key="5" style={styles.textContainer}>
					<Image
						source={require('../../assets/firstLaunchScreenImages/bitmap.png')}
						style={{ width: 350, height: 60, marginBottom: 15 }}
						resizeMode="contain"
					/>
					<Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 20 }}>
						Для доступа ко всем функциям приложения требуется регистрация
					</Text>
					<View style={{ width: '100%' }}>
						<TouchableOpacity
							onPress={() => {
								AsyncStorage.setItem('alreadyLaunched', 'true');
								props.resolveAuth({ prop: 'fistLaunchToken', value: true });
								props.resolveAuth({ prop: 'toSignupScreen', value: true });
								props.resolveAuth({ prop: 'toAuthFlow', value: true });
							}}
							style={styles.buttonStyle}
						>
							<View>
								<Text
									style={{ fontSize: 18, color: '#EB9156', fontWeight: 'bold' }}
								>
									Регистрация
								</Text>
							</View>
						</TouchableOpacity>
					</View>
					<View style={{ width: '100%' }}>
						<TouchableOpacity
							onPress={() => {
								AsyncStorage.setItem('alreadyLaunched', 'true');
								props.resolveAuth({ prop: 'fistLaunchToken', value: true });
								props.resolveAuth({ prop: 'toAuthFlow', value: true });
							}}
							style={styles.buttonStyle}
						>
							<View>
								<Text
									style={{ fontSize: 18, color: '#EB9156', fontWeight: 'bold' }}
								>
									Вход
								</Text>
							</View>
						</TouchableOpacity>
					</View>

					<TouchableOpacity
						style={{
							marginTop: 20,
							borderBottomWidth: 2,
							borderBottomColor: '#379683',
						}}
						onPress={() => {
							AsyncStorage.setItem('alreadyLaunched', 'true');
							props.resolveAuth({ prop: 'fistLaunchToken', value: true });
						}}
					>
						<Text style={{ fontSize: 16, color: '#EB9156' }}>
							Продолжить без регистрации
						</Text>
					</TouchableOpacity>
				</View>
			</ViewPager>
			<View style={styles.dotContainer}>
				<TouchableOpacity
					style={{ marginHorizontal: 10 }}
					onPress={() => {
						viewPager.current.setPage(0);
					}}
				>
					<FontAwesome name={page1} size={20} />
				</TouchableOpacity>
				<TouchableOpacity
					style={{ marginHorizontal: 10 }}
					onPress={() => {
						viewPager.current.setPage(1);
					}}
				>
					<FontAwesome name={page2} size={20} />
				</TouchableOpacity>
				<TouchableOpacity
					style={{ marginHorizontal: 10 }}
					onPress={() => {
						viewPager.current.setPage(2);
					}}
				>
					<FontAwesome name={page3} size={20} />
				</TouchableOpacity>
				<TouchableOpacity
					style={{ marginHorizontal: 10 }}
					onPress={() => {
						viewPager.current.setPage(3);
					}}
				>
					<FontAwesome name={page4} size={20} />
				</TouchableOpacity>
				<TouchableOpacity
					style={{ marginHorizontal: 10 }}
					onPress={() => {
						viewPager.current.setPage(4);
					}}
				>
					<FontAwesome name={page5} size={20} />
				</TouchableOpacity>
			</View>
		</>
	);
};

const padding = Platform.OS === 'ios' ? 40 : 20;

const styles = StyleSheet.create({
	viewPager: {
		flex: 1,
		backgroundColor: 'white',
		paddingBottom: padding,
	},

	textContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10,
	},
	dotContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		paddingBottom: padding,
		backgroundColor: 'white',
	},
	buttonStyle: {
		marginHorizontal: 5,
		marginVertical: 10,
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
		alignItems: 'center',
		height: 50,
		justifyContent: 'center',
	},
});

const mapStateToProps = ({ auth }) => {
	const { fistLaunchToken, isLoading, toSignupScreen } = auth;

	return { fistLaunchToken, isLoading, toSignupScreen };
};

export default connect(mapStateToProps, { resolveAuth })(FirstLaunchScreen);
