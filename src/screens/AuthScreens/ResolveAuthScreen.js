/* eslint-disable global-require */
/* import CookieManager from '@react-native-community/cookies'; */

/* Экран заглушка копирующий сплэшскрин и ожидает прогрузки параметров через редакс */

/* NPM */
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

/* OTHER */
import Indicator from '../../components/Indicator';

const ResolveAuthScreen = (props) => {
	/* 	CookieManager.get('https://leafs-app.lab-code.com/').then((cookies) => {
		console.log('CookieManager.get =>', cookies);
	}); */

	const { loading } = props;

	return (
		<View style={styles.containerStyle}>
			<View style={styles.center}>
				<Image
					source={require('../../../assets/newBootsplash.png')}
					style={{ width: 100, height: 100 }}
				/>
			</View>
			{loading ? <Indicator style={styles.indicator} /> : null}
		</View>
	);
};

const styles = StyleSheet.create({
	containerStyle: {
		flex: 1,
		backgroundColor: 'white',
		alignItems: 'center',
	},
	center: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	indicator: {
		backgroundColor: 'white',
		position: 'absolute',
		bottom: 50,
	},
});

const mapStateToProps = ({ auth }) => {
	const { loading } = auth;

	return {
		loading,
	};
};

export default connect(mapStateToProps, {})(ResolveAuthScreen);
