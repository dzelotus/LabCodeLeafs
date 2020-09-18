/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Pressable } from 'react-native';
import { connect } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AboutUsScreen from './screens/AboutUsScreen';
import AuthScreen from './screens/AuthScreen';
import CatalogItemScreen from './screens/CatalogItemScreen';
import CatalogScreen from './screens/CatalogScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import FirstLaunchScreen from './screens/FirstLaunchScreen';
import HelpScreen from './screens/HelpScreen';
import ItemScreen from './screens/ItemScreen';
import LastScanFullscreenPhotoScreen from './screens/LastScanFullscreenPhotoScreen';
import LastScanScreen from './screens/LastScanScreen';
import MainScreen from './screens/MainScreen';
import ProfileScreen from './screens/ProfileScreen';
import ResolveAuthScreen from './screens/ResolveAuthScreen';
import ScanLeafScreen from './screens/ScanLeafScreen';
import ScanPhotoScreen from './screens/ScanPhotoScreen';
import SigninScreen from './screens/SigninScreen';
import SignupScreen from './screens/SignupScreen';
import WishlistScreen from './screens/WishlistScreen';
import nodeApi from './api/nodeApi';
import { resolveAuth } from './actions/AuthActions';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const CatalogFlow = () => (
	<Stack.Navigator screenOptions={{ title: 'Каталог', headerTintColor: '#8DC34A' }}>
		<Stack.Screen name="Catalog" component={CatalogScreen} />
		<Stack.Screen name="CatalogItem" component={CatalogItemScreen} />
		<Stack.Screen name="Item" component={ItemScreen} />
	</Stack.Navigator>
);

const MainFlow = () => (
	<Stack.Navigator
		initialRouteName="Main"
		screenOptions={{
			title: 'Мои растения',
			headerTintColor: '#8DC34A',
			headerTitle: 'Мои растения',
		}}
	>
		<Stack.Screen name="Main" component={MainScreen} />
		<Stack.Screen
			name="Favorites"
			component={FavoritesScreen}
			options={{ title: 'Мои растения' }}
		/>
		<Stack.Screen name="Wishlist" component={WishlistScreen} />
		<Stack.Screen
			name="LastScan"
			component={LastScanScreen}
			options={{ title: 'Последние сканирования' }}
		/>
		<Stack.Screen
			name="LastScanFullscreenPhoto"
			component={LastScanFullscreenPhotoScreen}
			options={{ title: 'Последние сканирования' }}
		/>
	</Stack.Navigator>
);

const ProfileFlow = () => (
	<Stack.Navigator screenOptions={{ title: 'Профиль', headerTintColor: '#8DC34A' }}>
		<Stack.Screen name="Profile" component={ProfileScreen} />
		<Stack.Screen name="Help" component={HelpScreen} options={{ title: 'Помощь' }} />
		<Stack.Screen
			name="EditProfile"
			component={EditProfileScreen}
			options={{ title: 'Редактировать профиль' }}
		/>
		<Stack.Screen name="AboutUs" component={AboutUsScreen} options={{ title: 'О Нас' }} />
	</Stack.Navigator>
);

const CameraFlow = () => (
	<Stack.Navigator initialRouteName="ScanLeaf" screenOptions={{ headerShown: false }}>
		<Stack.Screen name="ScanLeaf" component={ScanLeafScreen} />
		<Stack.Screen name="ScanPhoto" component={ScanPhotoScreen} />
	</Stack.Navigator>
);

const AuthFlow = () => (
	<Stack.Navigator screenOptions={{ headerShown: false }}>
		<Stack.Screen name="Auth" component={AuthScreen} />
		<Stack.Screen name="Signup" component={SignupScreen} />
		<Stack.Screen name="Signin" component={SigninScreen} />
	</Stack.Navigator>
);

const TabNavigator = () => (
	<Tab.Navigator
		tabBarOptions={{
			activeTintColor: '#FF9800',
			inactiveTintColor: '#8DC34A',
			labelStyle: { fontSize: 10 },
			keyboardHidesTabBar: true,
		}}
	>
		<Tab.Screen
			name="Мои растения"
			component={MainFlow}
			options={{
				tabBarLabel: 'Мои растения',
				tabBarIcon: () => <Icon name="leaf" size={27} color="#8DC34A" />,
				tabBarButton: (props) => (
					<Pressable android_ripple={{ color: '#8DC34A', borderless: true }} {...props} />
				),
			}}
			initialParams={{ data: 'suck' }}
		/>

		<Tab.Screen
			name="Catalog"
			component={CatalogFlow}
			options={{
				tabBarLabel: 'Каталог',
				tabBarIcon: () => <Icon name="folder" size={27} color="#8DC34A" />,
				tabBarButton: (props) => (
					<Pressable android_ripple={{ color: '#8DC34A', borderless: true }} {...props} />
				),
			}}
		/>
		<Tab.Screen
			name="Camera"
			component={CameraFlow}
			options={{
				tabBarVisible: false,
				tabBarLabel: 'Определение ',
				tabBarIcon: () => <Icon name="camera" size={27} color="#8DC34A" />,
				tabBarButton: (props) => (
					<Pressable android_ripple={{ color: '#8DC34A', borderless: true }} {...props} />
				),
			}}
		/>
		<Tab.Screen
			name="Profile"
			component={ProfileFlow}
			options={{
				tabBarLabel: 'Профиль',
				tabBarIcon: () => <Icon name="user" size={27} color="#8DC34A" />,
				tabBarButton: (props) => (
					<Pressable android_ripple={{ color: '#8DC34A', borderless: true }} {...props} />
				),
			}}
		/>
	</Tab.Navigator>
);

const StackNavigator = (route) => {
	const [load, setLoad] = useState(false);

	// Проверка авторизации пользователя
	const checkAuth = async () => {
		// Проверяем наличия токена первого запуска
		await AsyncStorage.getItem('alreadyLaunched').then((value) => {
			if (!value) {
				// Если токена нет, запускаем FirstLaunchScreen
				route.resolveAuth({ prop: 'fistLaunchToken', value: false });
				route.resolveAuth({ prop: 'loadStart', value: true });
				setLoad(true);
			} else {
				// Если токен есть, проверяем аутентификацию пользователя
				route.resolveAuth({ prop: 'fistLaunchToken', value: true });
				nodeApi
					.get('user_authentication')
					.then((response) => {
						if (response.data.data) {
							route.resolveAuth({ prop: 'loadStart', value: true });
							setLoad(true);
							route.resolveAuth({ prop: 'isSigned', value: true });
						} else {
							route.resolveAuth({ prop: 'loadStart', value: true });
							setLoad(true);
							route.resolveAuth({ prop: 'isSigned', value: false });
						}
					})
					.catch((error) => {
						console.log(error);
					});
			}
		});
	};

	useEffect(() => {
		checkAuth();
	}, []);

	return (
		<Stack.Navigator>
			{!load ? (
				<Stack.Screen
					name="WhiteScreen"
					component={ResolveAuthScreen}
					options={{ headerShown: false }}
				/>
			) : !route.fistLaunchToken ? (
				<Stack.Screen
					name="FirstLaunch"
					component={FirstLaunchScreen}
					options={{ headerShown: false }}
				/>
			) : route.isSigned ? (
				<Stack.Screen
					name="MainNav"
					component={TabNavigator}
					options={{ headerShown: false }}
					initialParams={{ ko: 'to' }}
				/>
			) : (
				<Stack.Screen
					name="AuthFlow"
					component={AuthFlow}
					options={{ headerShown: false }}
				/>
			)}
		</Stack.Navigator>
	);
};

const mapStateToProps = ({ auth }) => {
	const { fistLaunchToken, isSigned, loadStart } = auth;

	return { fistLaunchToken, isSigned, loadStart };
};

export default connect(mapStateToProps, { resolveAuth })(StackNavigator);
