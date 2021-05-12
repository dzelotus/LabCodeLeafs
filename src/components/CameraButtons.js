/* Кнопки камеры для экрана сканирования */
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { withNavigation } from '@react-navigation/compat';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CameraButtons = ({ photo, flash, flashType, camera }) => (
	<View style={styles.container}>
		<View style={styles.reverseButton}>
			<TouchableOpacity onPress={camera}>
				<Ionicons name="camera-reverse" size={50} color="white" />
			</TouchableOpacity>
		</View>
		<View style={styles.shotButton}>
			<TouchableOpacity onPress={photo}>
				<Ionicons name="ios-radio-button-on" size={65} color="white" />
			</TouchableOpacity>
		</View>
		<View style={styles.flashButton}>
			<TouchableOpacity onPress={flash}>
				{flashType ? (
					<Ionicons name="ios-flash" size={50} color="white" />
				) : (
					<Ionicons name="ios-flash-off" size={50} color="white" />
				)}
			</TouchableOpacity>
		</View>
	</View>
);

const styles = StyleSheet.create({
	container: {
		justifyContent: 'flex-end',
		margin: 15,
		height: 40,
	},
	reverseButton: {
		alignSelf: 'flex-start',
		position: 'absolute',
	},
	shotButton: {
		alignSelf: 'center',
		position: 'absolute',
	},
	flashButton: {
		alignSelf: 'flex-end',
		position: 'absolute',
	},
});

export default withNavigation(CameraButtons);
