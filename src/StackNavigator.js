/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Pressable } from 'react-native';
import { connect } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AboutUsScreen from './screens/AboutUsScreen';
import CatalogItemScreen from './screens/CatalogItemScreen';
/* import CatalogScreen from './screens/CatalogScreen'; */
import EditProfileScreen from './screens/EditProfileScreen';
import GardenScreen from './screens/GardenScreen';
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
/* import AddPlantScreen from './screens/AddPlantScreen'; */
import AddPlantFormHook from './screens/AddPlantScreenFormHook';
import nodeApi from './api/nodeApi';
import { resolveAuth } from './actions/AuthActions';
import NewsScreen from './screens/NewsScreen';
import ArticleScreen from './screens/ArticleScreen';
import CatalogJsonScreen from './screens/CatalogJsonScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const CatalogFlow = () => (
	<Stack.Navigator screenOptions={{ title: 'Справочник', headerTintColor: '#379683' }}>
		<Stack.Screen name="Catalog" component={CatalogJsonScreen} />
		<Stack.Screen name="CatalogItem" component={CatalogItemScreen} />
		<Stack.Screen name="Item" component={ItemScreen} />
	</Stack.Navigator>
);

const MainFlow = () => (
	<Stack.Navigator
		initialRouteName="Main"
		screenOptions={{
			title: 'Мои растения',
			headerTintColor: '#379683',
			headerTitle: 'Мои растения',
		}}
	>
		<Stack.Screen name="Main" component={MainScreen} />
		<Stack.Screen name="News" component={NewsFlow} />
		<Stack.Screen name="Wishlist" component={WishlistScreen} />
		<Stack.Screen
			name="LastScan"
			component={LastScanScreen}
			options={{ headerTitle: 'Мои сканирования' }}
		/>
		<Stack.Screen
			name="LastScanFullscreenPhoto"
			component={LastScanFullscreenPhotoScreen}
			options={{ headerTitle: 'Последние сканирования' }}
		/>
	</Stack.Navigator>
);

const ProfileFlow = () => (
	<Stack.Navigator screenOptions={{ title: 'Профиль', headerTintColor: '#379683' }}>
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

const AuthFlow = (props) => {
	const { route } = props;
	console.log('ROUTE', route);
	return (
		<Stack.Navigator
			initialRouteName={route.params.data ? 'Signup' : 'Signin'}
			screenOptions={{ headerShown: false }}
		>
			<Stack.Screen name="Signup" component={SignupScreen} />
			<Stack.Screen name="Signin" component={SigninScreen} />
		</Stack.Navigator>
	);
};

const NewsFlow = () => (
	<Stack.Navigator
		initialRouteName="News"
		screenOptions={{ title: 'Статьи', headerTintColor: '#379683' }}
	>
		<Stack.Screen name="News" component={NewsScreen} options={() => ({ title: 'UP' })} />
		<Stack.Screen name="Article" component={ArticleScreen} />
	</Stack.Navigator>
);

const GardenFlow = () => (
	<Stack.Navigator initialRouteName="Garden">
		<Stack.Screen
			name="Garden"
			component={GardenScreen}
			options={{ headerTitle: 'Мой Огород', headerTintColor: '#379683' }}
		/>
		<Stack.Screen
			name="AddPlant"
			component={AddPlantFormHook}
			options={{ headerTitle: 'Добавить Растение', headerTintColor: '#379683' }}
		/>
	</Stack.Navigator>
);

const TabNavigator = () => (
	<Tab.Navigator
		tabBarOptions={{
			activeTintColor: '#EB9156',
			inactiveTintColor: '#379683',
			labelStyle: { fontSize: 10 },
			keyboardHidesTabBar: true,
		}}
	>
		<Tab.Screen
			name="Мои растения"
			component={MainFlow}
			options={{
				tabBarLabel: 'Мои растения',
				tabBarIcon: () => <Icon name="leaf" size={27} color="#379683" />,
				tabBarButton: (props) => (
					<Pressable android_ripple={{ color: '#379683', borderless: true }} {...props} />
				),
			}}
			initialParams={{ data: 'suck' }}
		/>

		<Tab.Screen
			name="Catalog"
			component={CatalogFlow}
			options={{
				tabBarLabel: 'Справочник',
				tabBarIcon: () => <Icon name="folder" size={27} color="#379683" />,
				tabBarButton: (props) => (
					<Pressable android_ripple={{ color: '#379683', borderless: true }} {...props} />
				),
			}}
		/>
		<Tab.Screen
			name="Garden"
			component={GardenFlow}
			options={{
				tabBarLabel: 'Дневник садовода',
				tabBarIcon: () => <Icon name="tasks" size={27} color="#379683" />,
				tabBarButton: (props) => (
					<Pressable android_ripple={{ color: '#379683', borderless: true }} {...props} />
				),
			}}
		/>
		<Tab.Screen
			name="Profile"
			component={ProfileFlow}
			options={{
				tabBarLabel: 'Профиль',
				tabBarIcon: () => <Icon name="user" size={27} color="#379683" />,
				tabBarButton: (props) => (
					<Pressable android_ripple={{ color: '#379683', borderless: true }} {...props} />
				),
			}}
		/>
	</Tab.Navigator>
);

const StackNavigator = (route) => {
	const [load, setLoad] = useState(false);
	console.log('STACK ROUTE', route);

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
						console.log('UA', response.data);
						if (response.data.data) {
							console.log('SIGNED');
							route.resolveAuth({ prop: 'isSigned', value: true });
							route.resolveAuth({ prop: 'loadStart', value: true });
							setLoad(true);
						} else {
							console.log('NOT SIGNED');
							route.resolveAuth({ prop: 'isSigned', value: false });
							route.resolveAuth({ prop: 'loadStart', value: true });
							setLoad(true);
						}
					})
					.catch((error) => {
						console.log(error.response);
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
					initialParams={{ data: route.toSignupScreen }}
					options={{ headerShown: false }}
				/>
			)}
			<Stack.Screen
				name="CameraFlow"
				component={CameraFlow}
				options={{ headerShown: false }}
			/>
		</Stack.Navigator>
	);
};

const mapStateToProps = ({ auth }) => {
	const { fistLaunchToken, isSigned, loadStart, toSignupScreen } = auth;

	return { fistLaunchToken, isSigned, loadStart, toSignupScreen };
};

export default connect(mapStateToProps, { resolveAuth })(StackNavigator);
