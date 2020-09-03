import { ImageBackground, Modal, View } from 'react-native';
import React, { useState } from 'react';

import GoBackButton from '../components/GoBackButton';

const LastScanFullscreenPhotoScreen = (route) => {
	const [modalVisible, setModalVisible] = useState(true);
	console.log(route);
	return (
		<View>
			<Modal
				animationType="slide"
				visible={modalVisible}
				onRequestClose={() => route.navigation.navigate('LastScan')}>
				<ImageBackground
					source={{ uri: route.route.params.uri }}
					style={{
						flex: 1,
						resizeMode: 'center',
						justifyContent: 'space-between',
					}}
					imageStyle={{ resizeMode: 'contain' }}>
					<GoBackButton nav="LastScan" />
				</ImageBackground>
			</Modal>
		</View>
	);
};

export default LastScanFullscreenPhotoScreen;
