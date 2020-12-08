/* eslint-disable no-unused-expressions */
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
					<Text style={{ fontSize: 20 }}>Добро пожаловать в Листочки</Text>
				</View>
				<View key="2" style={styles.textContainer}>
					<Text style={{ fontSize: 20 }}>В Листочках вы сможете</Text>
					<Text>Определить растения при помощи камеры</Text>
					<Text style={{ textAlign: 'center' }}>
						Воспользоваться каталогом растений и заболеваний от ведущих специалистов в
						области ботаники
					</Text>
				</View>
				<View key="3" style={styles.textContainer}>
					<Text style={{ textAlign: 'center', fontSize: 20 }}>
						Чтобы просканировать растение, сделайте такое фото, чтобы в область
						видимости попадал листок или цветок целиком
					</Text>
				</View>
				<View key="4" style={styles.textContainer}>
					<Text style={{ textAlign: 'center', fontSize: 20 }}>
						Для использования приложение требуется пройти регистрацию
					</Text>

					<View
						style={{
							flex: 0.1,
							justifyContent: 'flex-end',
						}}
					>
						<TouchableOpacity
							onPress={() => {
								console.log('TAP', console.log(props));
								AsyncStorage.setItem('alreadyLaunched', 'true');
								props.resolveAuth({ prop: 'fistLaunchToken', value: true });
							}}
							style={{
								borderBottomWidth: 1,
								borderBottomColor: '#379683',
							}}
						>
							<Text style={{ color: '#379683', fontSize: 18 }}>
								Перейти на экран входа и регистрации?
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ViewPager>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'center',
					marginBottom: 20,
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
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	viewPager: {
		flex: 1,
		marginTop: 26,
	},

	textContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10,
	},
});

const mapStateToProps = ({ auth }) => {
	const { fistLaunchToken, isLoading } = auth;

	return { fistLaunchToken, isLoading };
};

export default connect(mapStateToProps, { resolveAuth })(FirstLaunchScreen);
