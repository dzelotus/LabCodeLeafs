import { Provider, connect } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { applyMiddleware, createStore } from 'redux';

import { NavigationContainer } from '@react-navigation/native';
import ReduxThunk from 'redux-thunk';
import StackNavigator from './src/StackNavigator';
import { navigationRef } from './src/RootNavigation';
import reducer from './src/reducers/index';

const App = (route) => {
	const store = createStore(reducer, {}, applyMiddleware(ReduxThunk));

	return (
		<Provider store={store}>
			<NavigationContainer ref={navigationRef}>
				<StackNavigator />
			</NavigationContainer>
		</Provider>
	);
};

export default App;
