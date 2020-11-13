/* eslint-disable no-else-return */
/* eslint-disable operator-linebreak */
/* eslint-disable consistent-return */
import React, { useEffect } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	FlatList,
	ActivityIndicator,
	Alert,
} from 'react-native';
import { Input, Button } from 'react-native-elements';
import { connect } from 'react-redux';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
	inputChange,
	getCsrf,
	getGardens,
	openGarden,
	addButtonSwitch,
	createGarden,
	deleteGarden,
	changeButtonAction,
	editGarden,
	updateGarden,
} from '../actions/GardenActions';

const GardenScreen = (props) => {
	console.log('PROPS', props);
	const {
		gardenId,
		// eslint-disable-next-line no-unused-vars
		gardenName,
		// eslint-disable-next-line no-unused-vars
		gardenDescription,
		inputChange,
		csrf,
		getGardens,
		gardenData,
		addBtnSwitch,
		addButtonSwitch,
		createGarden,
		deleteGarden,
		buttonLoading,
		screenLoading,

		openGarden,
		itemOpenIndex,
		changeButtonAction,
		editButton,
		editGarden,
		updateGarden,
	} = props;

	/* 	navigation.addListener('focus', () => {
		);
	});
 */

	useEffect(() => {
		getGardens('screenLoading');
	}, []);

	const addGarden = () => {
		if (addBtnSwitch) {
			return (
				<View style={styles.addContainerStyle}>
					<View style={styles.addGardenCard}>
						<Input
							label="Название Огорода"
							onChangeText={(text) => {
								inputChange({
									prop: 'gardenName',
									value: text,
								});
							}}
							value={gardenName}
						/>
						<Input
							label="Описание"
							onChangeText={(text) => {
								inputChange({
									prop: 'gardenDescription',
									value: text,
								});
							}}
							value={gardenDescription}
						/>
						{loadingButton()}
						<View style={{ position: 'absolute', bottom: 0, right: 0 }}>
							<TouchableOpacity
								style={styles.addGardenBtnPressed}
								onPress={() => {
									addButtonSwitch(!addBtnSwitch);
								}}
							>
								<Icon name="close" size={30} color="#8DC34A" />
							</TouchableOpacity>
						</View>
					</View>
				</View>
			);
		}
		return (
			<View
				style={{
					position: 'absolute',
					bottom: 15,
					right: 15,
				}}
			>
				<TouchableOpacity
					style={styles.addGardenBtnNormal}
					onPress={() => {
						changeButtonAction(false);
						addButtonSwitch(!addBtnSwitch);
					}}
				>
					<Icon
						name="close"
						size={25}
						color="#8DC34A"
						style={{ transform: [{ rotate: '45deg' }] }}
					/>
				</TouchableOpacity>
			</View>
		);
	};

	const Indicator = () => (
		<View>
			<ActivityIndicator size="large" color="#8DC34A" />
		</View>
	);

	const loadingButton = () => {
		if (buttonLoading === true) {
			return <Indicator />;
		}
		return (
			<Button
				title={editButton ? 'Редактировать Огород' : 'Создать Огород'}
				onPress={() => {
					if (!editButton) {
						createGarden(gardenName, gardenDescription, csrf);
					} else {
						console.log('UPDATE TAP');
						updateGarden(gardenId, gardenName, gardenDescription, csrf);
					}
				}}
			/>
		);
	};

	const deleteAlert = (gardenId) => {
		Alert.alert(
			'Предупреждение',
			'Вы точно хотите удалить огород? Отмена удаления невозможна!',
			[
				{
					text: 'Отменить',
				},
				{
					text: 'Удалить',
					onPress: () => {
						deleteGarden(gardenId);
					},
				},
			],
		);
	};

	const openedGarden = (gardenId) => {
		if (itemOpenIndex[gardenId] === true) {
			return (
				<View style={{ flex: 1 }}>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'flex-end',
						}}
					>
						<TouchableOpacity
							onPress={() => {
								deleteAlert(gardenId);
							}}
						>
							<Icon name="delete-outline" size={30} color="red" />
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								changeButtonAction(true);
								addButtonSwitch(!addBtnSwitch);
								addGarden();
								editGarden(gardenId);
							}}
						>
							<Icon name="pencil-outline" size={30} color="orange" />
						</TouchableOpacity>
					</View>
					<View>
						<Text>Редактирование огорода {gardenId}</Text>
					</View>
				</View>
			);
		} /* else if (gardenOpen[gardenId] === 'edit') {
			return <Indicator />;
		} */
	};

	// eslint-disable-next-line react/destructuring-assignment
	if (screenLoading === true) {
		return <Indicator />;
	}
	return (
		<View style={{ flex: 1 }}>
			<View>
				<FlatList
					data={gardenData}
					renderItem={({ item }) => (
						<View>
							<View
								style={
									itemOpenIndex[item.id]
										? styles.gardenContainerPressed
										: styles.gardenContainerNormal
								}
							>
								<TouchableOpacity
									style={{
										flexDirection: 'row',
										flex: 1,
										justifyContent: 'space-between',
									}}
									onPress={(index) => {
										index = item.id;
										if (itemOpenIndex[index] === true) {
											openGarden({ ...itemOpenIndex, [index]: false });
										} else {
											openGarden({ ...itemOpenIndex, [index]: true });
										}
									}}
								>
									<Text>{item.name}</Text>
									<Text>{item.description}</Text>
									<Icon name="chevron-down" size={20} />
								</TouchableOpacity>
							</View>
							<View style={styles.gardenContainerOpened}>
								{openedGarden(item.id)}
							</View>
						</View>
					)}
				/>
			</View>
			{addGarden()}
		</View>
	);
};

const mapStateToProps = ({ garden }) => {
	const {
		gardenName,
		gardenDescription,
		csrf,
		screenLoading,
		gardenData,
		openGardenId,
		addBtnSwitch,
		buttonLoading,
		itemLoading,
		itemOpenIndex,
		editButton,
		gardenId,
	} = garden;
	return {
		gardenName,
		gardenDescription,
		csrf,
		screenLoading,
		gardenData,
		openGardenId,
		addBtnSwitch,
		buttonLoading,
		itemLoading,
		itemOpenIndex,
		editButton,
		gardenId,
	};
};

const styles = StyleSheet.create({
	addGardenBtnNormal: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 12,
		},
		shadowOpacity: 0.58,
		shadowRadius: 16.0,
		elevation: 3,
		borderRadius: 50,
		backgroundColor: '#fff',
		alignItems: 'center',
		width: 60,
		height: 60,
		justifyContent: 'center',
		borderColor: '#8DC34A',
		borderWidth: 1,
	},
	addGardenBtnPressed: {
		borderRadius: 50,
		backgroundColor: '#fff',
		alignItems: 'center',
		width: 60,
		height: 60,
		justifyContent: 'center',
	},

	addContainerStyle: {
		position: 'absolute',
		bottom: 0,
		width: '100%',
		alignSelf: 'center',
		alignContent: 'center',
	},
	addGardenCard: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 12,
		},
		shadowOpacity: 0.58,
		shadowRadius: 16.0,
		elevation: 3,
		borderRadius: 10,
		borderColor: '#000',
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		margin: 15,
		padding: 10,
	},

	gardenContainerNormal: {
		marginHorizontal: 15,
		marginTop: 15,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 12,
		},
		shadowOpacity: 0.58,
		shadowRadius: 16.0,
		elevation: 3,
		borderRadius: 10,
		borderColor: '#000',
		backgroundColor: '#fff',
		flexDirection: 'row',
		justifyContent: 'space-between',
		flex: 1,
	},
	gardenContainerPressed: {
		marginHorizontal: 15,
		marginTop: 15,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 12,
		},
		shadowOpacity: 0.58,
		shadowRadius: 16.0,
		elevation: 3,
		borderRadius: 10,
		borderColor: '#000',
		backgroundColor: '#fff',
		flexDirection: 'row',
		justifyContent: 'space-between',
		flex: 1,
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
	},
	gardenContainerOpened: {
		marginHorizontal: 15,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 12,
		},
		shadowOpacity: 0.58,
		shadowRadius: 16.0,
		elevation: 3,
		borderRadius: 10,
		borderColor: '#000',
		backgroundColor: '#fff',
		flexDirection: 'row',
		justifyContent: 'space-between',
		flex: 1,
		borderTopLeftRadius: 0,
		borderTopRightRadius: 0,
	},
});

export default connect(mapStateToProps, {
	inputChange,
	getCsrf,
	getGardens,
	openGarden,
	addButtonSwitch,
	createGarden,
	deleteGarden,
	changeButtonAction,
	editGarden,
	updateGarden,
})(GardenScreen);
