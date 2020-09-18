import React from 'react';
import { connect } from 'react-redux';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

const Tab = createMaterialBottomTabNavigator();

const TabNavigator = (route) => {
	console.log('ROUTE', route);
	/* useEffect(() => {
    route.hideTabBar({ value: null });
  }); */
	return (
		<Tab.Navigator barStyle={{ height: route.tabBarHeight }}>
			<Tab.Screen
				name="Main"
				component={route.MainFlow}
				options={{
					tabBarLabel: 'Огород',
				}}
			/>
			<Tab.Screen name="Catalog" component={route.CatalogFlow} />
			<Tab.Screen name="Camera" component={route.CameraFlow} />
			<Tab.Screen name="Profile" component={route.ProfileFlow} />
		</Tab.Navigator>
	);
};

const mapStateToProps = ({ hideTab }) => {
	const { tabBarHeight } = hideTab;
	return { tabBarHeight };
};

export default connect(mapStateToProps, {})(TabNavigator);
