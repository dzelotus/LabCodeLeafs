import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/FontAwesome';
import React from 'react';
import { withNavigation } from '@react-navigation/compat';

const LastScansCard = ({ iconName, navigation, nav, headerText, data }) => {
	const renderItem = ({ item }) => {
		const imageUrl = item.image_url;
		const imageUrlReady = imageUrl
			.replace('/var/leafs_files/upload/', 'https://leafs-app.lab-code.com/upload/')
			.replace('/usr/src/leafs_files/upload/', 'https://leafs-app.lab-code.com/upload/');

		return (
			<TouchableOpacity
				onPress={() =>
					navigation.navigate('LastScanFullscreenPhoto', {
						uri: imageUrlReady,
						route: 'Main',
					})
				}
			>
				<FastImage
					style={styles.image}
					source={{ uri: imageUrlReady }}
					resizeMode="contain"
				/>
			</TouchableOpacity>
		);
	};

	return (
		<View style={styles.containerStyle}>
			<View style={styles.cardStyle}>
				<TouchableOpacity
					style={styles.rowDirection}
					onPress={() => navigation.navigate(nav, { data })}
				>
					<Icon name={iconName} size={30} color="#379683" />
					<Text style={styles.cardHeaderText}>{headerText}</Text>
				</TouchableOpacity>
			</View>
			<TouchableOpacity
				style={styles.scanButtonStyle}
				onPress={() => navigation.navigate('CameraFlow')}
			>
				<View style={styles.rowDirection}>
					<Icon name="camera" size={25} color="#379683" />
					<Text style={{ fontSize: 18, marginLeft: 10, color: '#EB9156' }}>
						Сканировать растение
					</Text>
				</View>
			</TouchableOpacity>
			<View style={{ marginLeft: 10, marginRight: 15 }}>
				<FlatList
					horizontal
					keyExtractor={(item) => item.id}
					data={data}
					renderItem={renderItem}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	containerStyle: {
		marginHorizontal: 5,
		marginBottom: 10,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		borderRadius: 10,
		borderColor: '#000',
		backgroundColor: '#fff',
	},
	scanButtonStyle: {
		marginHorizontal: 15,
		marginVertical: 10,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,

		elevation: 5,
		borderRadius: 10,
		borderColor: '#379683',
		borderWidth: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		height: 40,
		justifyContent: 'center',
	},
	cardStyle: {
		paddingTop: 10,
		paddingHorizontal: 10,
	},
	cardHeaderText: {
		textAlignVertical: 'center',
		marginLeft: 20,
		fontSize: 20,
		color: '#379683',
	},
	cardItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingRight: 10,
	},
	lastCardItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingBottom: 10,
		marginRight: 10,
	},
	textItem: {
		flex: 1,
		fontSize: 15,
	},
	image: {
		width: 100,
		height: 100,
		marginBottom: 10,
		marginHorizontal: 5,
		borderColor: 'red',
		borderRadius: 5,
	},
	rowDirection: {
		flexDirection: 'row',
	},
});

export default withNavigation(LastScansCard);
