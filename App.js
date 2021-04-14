import { Provider } from 'react-redux';
import React from 'react';
import { applyMiddleware, createStore } from 'redux';

import { NavigationContainer } from '@react-navigation/native';
import ReduxThunk from 'redux-thunk';
import RNBootSplash from 'react-native-bootsplash';
import StackNavigator from './src/AppNavigation_v2';
import { navigationRef } from './src/RootNavigation';
import reducer from './src/reducers/index';

const App = () => {
	const store = createStore(reducer, {}, applyMiddleware(ReduxThunk));
	RNBootSplash.hide();
	return (
		<Provider store={store}>
			<NavigationContainer ref={navigationRef}>
				<StackNavigator />
			</NavigationContainer>
		</Provider>
	);
};

export default App;
