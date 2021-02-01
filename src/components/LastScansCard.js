import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/FontAwesome';
import React, { useState } from 'react';
import { withNavigation } from '@react-navigation/compat';
import Modal from 'react-native-modal';

const LastScansCard = ({ iconName, navigation, nav, headerText, data }) => {
	const [showModal, setShowModal] = useState(false);

	const canScan = [
		'Персик',
		'Хурма',
		'Мушмула',
		'Черешня',
		'Лавр',
		'Груша',
		'Слива',
		'Яблоня',
		'Виноград',
		'Цитрусы',
		'Инжир',
		'Гранат',
		'Фейхоа',
		'Киви',
	];

	const renderItem = ({ item }) => {
		console.log('ITEM', item);
		const imageUrl = item.thumbnail_url ? item.thumbnail_url : item.image_url;
		const imageUrlReady = imageUrl
			.replace('/var/leafs_files/upload/', 'https://leafs-app.lab-code.com/upload/')
			.replace('/usr/src/leafs_files/upload/', 'https://leafs-app.lab-code.com/upload/');

		const compressedUrl = item.compressed_url ? item.compressed_url : item.image_url;
		const compressedUrlReady = compressedUrl
			.replace('/var/leafs_files/upload/', 'https://leafs-app.lab-code.com/upload/')
			.replace('/usr/src/leafs_files/upload/', 'https://leafs-app.lab-code.com/upload/');

		return (
			<TouchableOpacity
				onPress={() =>
					navigation.navigate('LastScanFullscreen', {
						screen: 'LastScanFullscreenPhoto',
						params: { uri: compressedUrlReady, route: 'Main', show: true },
					})
				}
			>
				<FastImage
					style={styles.image}
					source={{ uri: imageUrlReady }}
					resizeMode="cover"
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
			<TouchableOpacity onPress={() => setShowModal(true)} style={{ paddingBottom: 10 }}>
				<Text
					style={{
						textDecorationLine: 'underline',
						textAlign: 'center',
						fontSize: 16,
						color: '#EB9156',
					}}
				>
					Что мы умеем?
				</Text>
			</TouchableOpacity>
			<Modal
				isVisible={showModal}
				onBackButtonPress={() => setShowModal(false)}
				onSwipeComplete={() => setShowModal(false)}
				swipeDirection="down"
			>
				<View style={styles.modalContainer}>
					<Text style={{ textAlign: 'center', fontSize: 16 }}>
						На текущий момент наша нейросеть может распозновать следующие растения:
					</Text>
					<FlatList
						data={canScan}
						renderItem={(item) => {
							console.log(item);
							return (
								<View key={item.index}>
									<Text style={{ fontSize: 15, textAlign: 'left' }}>
										{item.item}
									</Text>
								</View>
							);
						}}
						keyExtractor={(item) => item}
					/>
					<TouchableOpacity
						style={styles.scanButtonStyle}
						onPress={() => setShowModal(false)}
					>
						<Text style={{ margin: 10, color: '#EB9156' }}>Понятно</Text>
					</TouchableOpacity>
				</View>
			</Modal>
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
	modalContainer: {
		margin: 15,
		backgroundColor: 'white',
		borderRadius: 5,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
});

export default withNavigation(LastScansCard);
