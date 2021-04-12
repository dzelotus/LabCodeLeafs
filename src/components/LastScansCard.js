/* eslint-disable operator-linebreak */
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/FontAwesome';
import React, { useState } from 'react';
import { withNavigation } from '@react-navigation/compat';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';

const LastScansCard = ({ iconName, navigation, nav, headerText, data, isSigned }) => {
	const [showModal, setShowModal] = useState(false);

	console.log(isSigned);
	const canScan = [
		'Яблоня',
		'Цитрус',
		'Фейхоа',
		'Инжир',
		'Виноград',
		'Лавр',
		'Мушмула',
		'Черешня',
		'Груша',
		'Хурма',
		'Гранат',
	];

	const canScanFlowers = ['Тюльпана', 'Розы'];

	const renderItem = ({ item }) => {
		const imageUrl = item.thumbnail_url ? item.thumbnail_url : item.image_url;
		const imageUrlReady = imageUrl
			.replace('/var/leafs_files/upload/', 'https://api.leafs.pro/upload/')
			.replace('/usr/src/leafs_files/upload/', 'https://api.leafs.pro/upload/');

		/* const compressedUrl = item.compressed_url ? item.compressed_url : item.image_url; */
		/* 	const compressedUrlReady = compressedUrl
			.replace('/var/leafs_files/upload/', 'https://leafs-app.lab-code.com/upload/')
			.replace('/usr/src/leafs_files/upload/', 'https://leafs-app.lab-code.com/upload/'); */

		return (
			<TouchableOpacity
				onPress={() =>
					navigation.navigate('LastScanFullscreenPhoto', {
						data: item,
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
				onPress={() => {
					isSigned
						? navigation.navigate('CameraFlow')
						: navigation.navigate('NotAuthScreen');
				}}
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
			<TouchableOpacity onPress={() => setShowModal(true)} style={{ paddingVertical: 10 }}>
				<Text
					style={{
						textDecorationLine: 'underline',
						textAlign: 'center',
						fontSize: 18,
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
				style={{
					justifyContent: 'flex-end',
					margin: 0,
				}}
			>
				<View
					style={{
						borderColor: '#fff',
						borderWidth: 3,
						marginHorizontal: 50,
						borderRadius: 3,
						marginBottom: 10,
						width: 45,
						alignSelf: 'center',
					}}
				/>
				<View style={styles.modalContainer}>
					<View
						style={{
							height: 25,
							justifyContent: 'center',
						}}
					/>
					<View>
						<Text
							style={{
								textAlign: 'center',
								fontSize: 20,
								marginBottom: 10,
								fontWeight: 'bold',
							}}
						>
							Нейросеть может автоматически распознать:
						</Text>
						<Text style={styles.rowName}>1. Листья:</Text>
						<FlatList
							data={canScan}
							renderItem={(item) => {
								return (
									<View
										key={item.index}
										style={{ paddingHorizontal: 10, marginBottom: 5 }}
									>
										<Text
											style={{
												fontSize: 16,
												textAlign: 'left',
												paddingLeft: 30,
											}}
										>
											{item.item}
										</Text>
									</View>
								);
							}}
							keyExtractor={(item) => item}
						/>
						<Text style={styles.rowName}>2. Цветы:</Text>
						<FlatList
							data={canScanFlowers}
							renderItem={(item) => {
								return (
									<View
										key={item.index}
										style={{ paddingHorizontal: 10, marginBottom: 10 }}
									>
										<Text
											style={{
												fontSize: 16,
												textAlign: 'left',
												paddingLeft: 30,
											}}
										>
											{item.item}
										</Text>
									</View>
								);
							}}
							keyExtractor={(item) => item}
						/>
						<Text style={{ paddingHorizontal: 10, textAlign: 'center' }}>
							Скоро растений станет больше, нейросеть постоянно обновляется!
						</Text>
					</View>
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
		backgroundColor: 'white',
		borderTopRightRadius: 25,
		borderTopLeftRadius: 25,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		paddingBottom: 50,
	},
	rowName: {
		fontSize: 18,
		paddingLeft: 20,
		marginBottom: 10,
	},
});

const mapStateToProps = ({ auth }) => {
	const { isSigned } = auth;

	return {
		isSigned,
	};
};

export default withNavigation(connect(mapStateToProps, {})(LastScansCard));
