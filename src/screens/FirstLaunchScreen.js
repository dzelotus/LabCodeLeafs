/* eslint-disable global-require */
/* eslint-disable no-unused-expressions */
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RNBootSplash from 'react-native-bootsplash';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ViewPager from '@react-native-community/viewpager';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
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
					<Image
						source={require('../../assets/firstLaunchScreenImages/position1.png')}
						style={{ width: 200, height: 200, marginBottom: 15 }}
					/>
					<Text style={{ fontSize: 45, fontWeight: 'bold', color: '#379683' }}>
						LEAFS
					</Text>
					<Text style={{ fontSize: 20, textAlign: 'center' }}>
						Приложение для каждого садовода
					</Text>
				</View>
				<View key="2" style={styles.textContainer}>
					<Image
						source={require('../../assets/firstLaunchScreenImages/position2.png')}
						style={{ width: 250, height: 250, marginBottom: 15 }}
					/>
					<Text style={{ fontSize: 45, fontWeight: 'bold', color: '#379683' }}>
						LEAFS
					</Text>
					<Text style={{ fontSize: 20, textAlign: 'center' }}>
						Мнгновенное определние растений и заболеваний
					</Text>
				</View>
				<View key="3" style={styles.textContainer}>
					<Image
						source={require('../../assets/firstLaunchScreenImages/position3.png')}
						style={{ width: 250, height: 250, marginBottom: 15 }}
					/>
					<Text style={{ fontSize: 45, fontWeight: 'bold', color: '#379683' }}>
						LEAFS
					</Text>
					<Text style={{ fontSize: 20, textAlign: 'center' }}>
						Удобный и функциональный дневник садовода
					</Text>
				</View>
				<View key="4" style={styles.textContainer}>
					<Image
						source={require('../../assets/firstLaunchScreenImages/position4.png')}
						style={{ width: 250, height: 250, marginBottom: 15 }}
					/>
					<Text style={{ fontSize: 45, fontWeight: 'bold', color: '#379683' }}>
						LEAFS
					</Text>
					<Text style={{ fontSize: 20, textAlign: 'center' }}>
						Личный доктор Ваших растений
					</Text>
				</View>
				<View key="5" style={styles.textContainer}>
					<Text style={{ fontSize: 45, fontWeight: 'bold', color: '#379683' }}>
						LEAFS
					</Text>
					<Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 20 }}>
						Для доступа ко всем функциям приложения требуется регистрация
					</Text>
					<Button
						containerStyle={{ paddingHorizontal: 8, width: '100%', paddingBottom: 15 }}
						buttonStyle={{ backgroundColor: '#379683', height: 48 }}
						title="Регистрация"
						onPress={() => {
							AsyncStorage.setItem('alreadyLaunched', 'true');
							props.resolveAuth({ prop: 'fistLaunchToken', value: true });
							props.resolveAuth({ prop: 'toSignupScreen', value: true });
						}}
					/>
					<Button
						containerStyle={{ paddingHorizontal: 8, width: '100%' }}
						buttonStyle={{ backgroundColor: '#379683', height: 48 }}
						title="Вход"
						onPress={() => {
							AsyncStorage.setItem('alreadyLaunched', 'true');
							props.resolveAuth({ prop: 'fistLaunchToken', value: true });
						}}
					/>
				</View>
			</ViewPager>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'center',
					paddingBottom: 20,
					backgroundColor: 'white',
				}}
			>
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

const styles = StyleSheet.create({
	viewPager: {
		flex: 1,

		backgroundColor: 'white',
	},

	textContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10,
	},
});

const mapStateToProps = ({ auth }) => {
	const { fistLaunchToken, isLoading, toSignupScreen } = auth;

	return { fistLaunchToken, isLoading, toSignupScreen };
};

export default connect(mapStateToProps, { resolveAuth })(FirstLaunchScreen);
