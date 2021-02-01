import React from 'react';
import { Image, View, Platform, StyleSheet } from 'react-native';

import GoBackButton from '../components/GoBackButton';

const LastScanFullscreenPhotoScreen = ({ route }) => {
	console.log('ROUTE', route);

	return (
		<View style={{ flex: 1 }}>
			<Image
				source={{ uri: route.params.uri }}
				style={{
					flex: 1,
					resizeMode: 'contain',
				}}
			/>

			<View style={styles.backButtonContainer}>
				<GoBackButton nav={route.params.route} />
			</View>
		</View>
	);
};

const padding = Platform.OS === 'ios' ? 50 : 0;

const styles = StyleSheet.create({
	backButtonContainer: {
		position: 'absolute',
		alignSelf: 'flex-start',
		justifyContent: 'center',
		paddingTop: padding,
	},
});

export default LastScanFullscreenPhotoScreen;
