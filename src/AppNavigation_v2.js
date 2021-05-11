/* eslint-disable no-nested-ternary */
/* ***NPM*** */
import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Pressable } from 'react-native';
import { connect } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import SQLite from 'react-native-sqlite-storage';
/* ***OTHERS*** */
import {
	resolveAuth,
	checkInternetConnection,
	resolveLoading,
	checkAuth,
	refreshConnection,
} from './actions/AuthActions';

/* ***SCREENS*** */
// Экран первого запуска
import FirstLaunchScreen from './screens/FirstLaunchScreen';
// Главный экран
import MainScreen from './screens/MainScreen';
// Экраный авторизации, регистрации
import SigninScreen from './screens/AuthScreens/SigninScreen';
import SignupScreen from './screens/AuthScreens/SignupScreen';
import ResolveAuthScreen from './screens/AuthScreens/ResolveAuthScreen';
// Экраны сканирования
import ScanLeafScreen from './screens/ScanScreens/ScanLeafScreen';
import ScanPhotoScreen from './screens/ScanScreens/ScanPhotoScreen';
import LastScanFullscreenPhotoScreen from './screens/ScanScreens/LastScanFullscreenPhotoScreen';
import LastScanScreen from './screens/ScanScreens/LastScanScreen';
// Экраны новостей
import NewsScreen from './screens/NewsScreens/NewsScreen';
import ArticleScreen from './screens/NewsScreens/ArticleScreen';

// Экран погоды
import WeatherScreen from './screens/MoonWeatherWidget/WeatherScreen';
// Экран лунного календаря
import MoonCalendarScreen from './screens/MoonWeatherWidget/MoonCalendarScreen';
// Экраны справочника
import CatalogScreen from './screens/CatalogScreens/CatalogScreen';
import CatalogPlantScreen from './screens/CatalogScreens/CatalogPlantScreen';
import CatalogDiseaseScreen from './screens/CatalogScreens/CatalogDiseaseScreen';
import CatalogHealScreen from './screens/CatalogScreens/CatalogHealScreen';
// Экраны дневника садовода
import GardenScreen from './screens/GardenScreens/GardenScreen';
import AddPlantFormHook from './screens/GardenScreens/AddPlantScreenFormHook';
// Экраны профиля
import ProfileScreen from './screens/ProfileScreens/ProfileScreen';
import EditProfileScreen from './screens/ProfileScreens/EditProfileScreen';
import AboutUsScreen from './screens/ProfileScreens/AboutUsScreen';
import HelpScreen from './screens/ProfileScreens/HelpScreen';
// Экран не аутентифицированного пользователя
import NotAuthUserScreen from './screens/NotAuthScreen';
// Экран отсутствия соединения с интернет
import NoInternetConnectionScreen from './screens/NoInternetConnectionScreen';

import { populateLocalTables, populateLocalHealTable } from './database/populateLocalTables';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/* Навигатор для главного экрана (вкладка "Мои растения") */
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
		<Stack.Screen
			name="LastScan"
			component={LastScanScreen}
			options={{ headerTitle: 'Мои сканирования' }}
		/>
		<Stack.Screen name="LastScanFullscreenPhoto" component={LastScanFullscreenPhotoScreen} />
		<Stack.Screen name="NotAuthScreen" component={NotAuthUserScreen} />
	</Stack.Navigator>
);

/* Навигатор для вкладки Справочник */
const CatalogFlow = () => (
	<Stack.Navigator screenOptions={{ title: 'Справочник', headerTintColor: '#379683' }}>
		<Stack.Screen name="Catalog" component={CatalogScreen} />
		<Stack.Screen name="CatalogPlant" component={CatalogPlantScreen} />
		<Stack.Screen name="CatalogDisease" component={CatalogDiseaseScreen} />
		<Stack.Screen name="CatalogHeal" component={CatalogHealScreen} />
	</Stack.Navigator>
);

/* Навигатор для вкладки Профиль */
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

/* Навигатор сканирования фотографий  */
const CameraFlow = () => (
	<Stack.Navigator initialRouteName="ScanLeaf" screenOptions={{ headerShown: false }}>
		<Stack.Screen name="ScanLeaf" component={ScanLeafScreen} />
		<Stack.Screen name="ScanPhoto" component={ScanPhotoScreen} />
	</Stack.Navigator>
);

/* Навигатор виджета новостей и новостной ленты */
const NewsFlow = () => (
	<Stack.Navigator
		initialRouteName="News"
		screenOptions={{ title: 'Статьи', headerTintColor: '#379683' }}
	>
		<Stack.Screen name="News" component={NewsScreen} />
		<Stack.Screen name="Article" component={ArticleScreen} />
	</Stack.Navigator>
);

/* Навигатор регистрации и авторизации */
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

/* Навигатор Дневника садовода */
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

/* BottomTab навигатор. Объединяет другие StackNavigator для отображения. */
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
	console.log('STACK ROUTE', route);

	const {
		hasInternetConnection,
		checkInternetConnection,
		firstLaunchToken,
		resolveAuth,
		resolveLoading,
		startWithoutInternet,
		loading,
		checkAuth,
		refreshConnection,
	} = route;

	const checkFirstLaunchToken = () => {
		console.log('FLT FUNCTION');
		AsyncStorage.getItem('alreadyLaunched')
			.then((value) => {
				console.log('TOKEN', value);
				if (!value) {
					resolveAuth({ prop: 'firstLaunchToken', value: false });
				} else {
					resolveAuth({ prop: 'firstLaunchToken', value: true });
				}
			})
			.catch(() => console.log('ERR'));
	};

	const loadTables = async () => {
		await populateLocalTables('plant');
		await populateLocalTables('disease');
		await populateLocalHealTable('heal');
	};

	useEffect(() => {
		SQLite.enablePromise(true);
		/* SQLite.DEBUG(true); */
		checkInternetConnection();
		checkFirstLaunchToken();
		refreshConnection();
		if (hasInternetConnection === true) {
			loadTables().then(() => resolveLoading(false));
			checkAuth();
		} else if (hasInternetConnection !== 'wait') {
			resolveLoading(false);
		}
	}, [hasInternetConnection]);

	return (
		<Stack.Navigator>
			{loading ? (
				<Stack.Screen
					name="WhiteScreen"
					component={ResolveAuthScreen}
					options={{ headerShown: false }}
				/>
			) : !firstLaunchToken ? (
				<Stack.Screen
					name="FirstLaunch"
					component={FirstLaunchScreen}
					options={{ headerShown: false }}
				/>
			) : !startWithoutInternet ? (
				<Stack.Screen
					name="NoInternetConnection"
					component={NoInternetConnectionScreen}
					options={{ headerShown: false }}
				/>
			) : route.toAuthFlow ? (
				<Stack.Screen
					name="AuthFlow"
					component={AuthFlow}
					initialParams={{ data: route.toSignupScreen }}
					options={{ headerShown: false }}
				/>
			) : (
				<Stack.Screen
					name="MainNav"
					component={TabNavigator}
					options={{ headerShown: false }}
				/>
			)}
			<Stack.Screen
				name="CameraFlow"
				component={CameraFlow}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Signup"
				component={SignupScreen}
				options={{ headerTitle: 'Зарегистрироваться', headerTintColor: '#379683' }}
			/>
			<Stack.Screen
				name="Signin"
				component={SigninScreen}
				options={{ headerTitle: 'Войти', headerTintColor: '#379683' }}
			/>
			<Stack.Screen
				name="WeatherScreen"
				component={WeatherScreen}
				options={{ headerTitle: 'Погода', headerTintColor: '#379683' }}
			/>
			<Stack.Screen
				name="MoonCalendar"
				component={MoonCalendarScreen}
				options={{ headerTitle: 'Лунный календарь', headerTintColor: '#379683' }}
			/>
		</Stack.Navigator>
	);
};

const mapStateToProps = ({ auth }) => {
	const {
		firstLaunchToken,
		isSigned,
		toSignupScreen,
		toAuthFlow,
		hasInternetConnection,
		startWithoutInternet,
		loading,
	} = auth;

	return {
		firstLaunchToken,
		isSigned,
		toSignupScreen,
		toAuthFlow,
		hasInternetConnection,
		startWithoutInternet,
		loading,
	};
};

export default connect(mapStateToProps, {
	resolveAuth,
	checkInternetConnection,
	resolveLoading,
	checkAuth,
	refreshConnection,
})(StackNavigator);
