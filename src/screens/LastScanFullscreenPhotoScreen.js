import { ImageBackground, Modal, View } from 'react-native';
import React from 'react';

import GoBackButton from '../components/GoBackButton';

const LastScanFullscreenPhotoScreen = ({ route, navigation }) => (
	<View>
		<Modal
			animationType="slide"
			visible
			onRequestClose={() => navigation.navigate(route.params.route)}
		>
			<ImageBackground
				source={{ uri: route.params.uri }}
				style={{
					flex: 1,
					resizeMode: 'center',
					justifyContent: 'space-between',
				}}
				imageStyle={{ resizeMode: 'contain' }}
			>
				<GoBackButton nav={route.params.route} />
			</ImageBackground>
		</Modal>
	</View>
);

export default LastScanFullscreenPhotoScreen;
