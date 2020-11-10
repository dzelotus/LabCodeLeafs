/* eslint-disable no-else-return */
/* eslint-disable operator-linebreak */
/* eslint-disable consistent-return */
import React, { useEffect, useState } from 'react';
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
import { inputChange, getCsrf, getGardens, openGarden } from '../actions/GardenActions';

import nodeApi from '../api/nodeApi';

const GardenScreen = (props) => {
	console.log('PROPS', props);
	const {
		// eslint-disable-next-line no-unused-vars
		gardenName,
		// eslint-disable-next-line no-unused-vars
		gardenDescription,
		inputChange,
		csrf,
		getCsrf,
		getGardens,
		gardenData,
	} = props;

	const [check, setCheck] = useState(false);
	const [newGarden, setNewGarden] = useState({
		name: '',
		description: '',
		id: '',
	});
	const [loading, setLoading] = useState({
		screenLoading: false,
		buttonLoading: false,
		gardenLoading: false,
	});
	const [editLoading, setEditLoading] = useState();
	const [gardenOpen, setGardenOpen] = useState({});
	const [btnTitle, setBtnTitle] = useState({ title: '', edit: false });

	useEffect(() => {
		getCsrf();
		getGardens();
	}, []);

	const addGarden = () => {
		if (check) {
			return (
				<View style={styles.addContainerStyle}>
					<View style={styles.addGardenCard}>
						<Input
							label="Название Огорода"
							onChangeText={(text) => {
								setNewGarden({ ...newGarden, name: text });
								inputChange({
									prop: 'gardenName',
									value: text,
								});
							}}
							value={newGarden.name}
						/>
						<Input
							label="Описание"
							onChangeText={(text) => {
								setNewGarden({ ...newGarden, description: text });
								inputChange({
									prop: 'gardenDescription',
									value: text,
								});
							}}
							value={newGarden.description}
						/>
						{loadingButton()}
						<View style={{ position: 'absolute', bottom: 0, right: 0 }}>
							<TouchableOpacity
								style={styles.addGardenBtnPressed}
								onPress={() => {
									setCheck(false);
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
						setBtnTitle({ title: 'Создать огород', edit: false });
						console.log('CREATE BTN', btnTitle);
						setCheck(true);
						setNewGarden({ name: '', description: '' });
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

	const createGarden = () => {
		setLoading({ buttonLoading: true });
		nodeApi
			.post('/garden', {
				name: newGarden.name,
				description: newGarden.description,
				_csrf: csrf,
			})
			.then((response) => {
				console.log('GARDEN CREATE', response);
				setLoading({ buttonLoading: false });
				setCheck(false);
				getGardens();
			})
			.catch((error) => {
				console.log(error.response);
				setLoading({ buttonLoading: false });
			});
	};

	const editGarden = (gardenId) => {
		nodeApi
			.get(`garden/${gardenId}/edit`)
			.then((response) => {
				setNewGarden({
					name: response.data.data.name,
					description: response.data.data.description,
					id: response.data.data.id,
				});
			})
			.catch((error) => console.log(error));
	};

	const updateGarden = () => {
		console.log('START UPDATE');
		setEditLoading(() => true);

		console.log('LOADING SETTED', editLoading);
		setGardenOpen({ ...gardenOpen, [newGarden.id]: 'edit' });
		nodeApi
			.put(`garden/${newGarden.id}`, {
				name: newGarden.name,
				description: newGarden.description,
				_csrf: csrf,
			})
			.then((response) => {
				console.log('GARDEN UPDATE', response);
				console.log('GARDEN ID', newGarden.id);
				setCheck(false);
				getGardens();

				setGardenOpen({ ...gardenOpen, [newGarden.id]: true });
			})
			.catch((error) => {
				console.log(error.response);
			});
	};

	const Indicator = () => (
		<View>
			<ActivityIndicator size="large" color="#8DC34A" />
		</View>
	);

	const loadingButton = () => {
		if (loading.buttonLoading === true) {
			return <Indicator />;
		}
		return (
			<Button
				title={btnTitle.title}
				onPress={() => {
					if (btnTitle.edit === false) {
						createGarden();
					} else {
						console.log('UPDATE TAP');
						updateGarden();
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

	const deleteGarden = (gardenId) => {
		setLoading({ buttonLoading: true });
		setGardenOpen({ ...gardenOpen, gardenId: 'edit' });
		console.log('BTN TITLE', btnTitle);
		nodeApi
			.delete(`garden/${gardenId}`)
			.then((response) => {
				console.log(response);
				getGardens();
			})
			.catch((error) => console.log(error));
	};

	const openedGarden = (gardenId) => {
		if (gardenOpen[gardenId] === true) {
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
								setBtnTitle({ title: 'Редактировать', edit: true });
								setCheck(!check);
								addGarden();
								editGarden(gardenId);
								console.log('EDIT BUTTON', btnTitle);
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
		} else if (gardenOpen[gardenId] === 'edit') {
			return <Indicator />;
		}
	};

	// eslint-disable-next-line react/destructuring-assignment
	if (props.loading === true) {
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
									gardenOpen[item.id]
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
										if (gardenOpen[index] === true) {
											setGardenOpen({
												...gardenOpen,
												[index]: false,
											});
											openGarden({ [index]: false });
										} else {
											setGardenOpen({
												...gardenOpen,
												[index]: true,
											});
											openGarden({ [index]: true });
										}
									}}
								>
									<Text>{item.name}</Text>
									<Text>{item.description}</Text>
									<Icon name="chevron-down" size={20} />
								</TouchableOpacity>
							</View>
							<View style={styles.gardenContainerOpened}>
								{openedGarden(item.id, item.name, item.description)}
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
	const { gardenName, gardenDescription, csrf, loading, gardenData, openGardenId } = garden;
	return { gardenName, gardenDescription, csrf, loading, gardenData, openGardenId };
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

export default connect(mapStateToProps, { inputChange, getCsrf, getGardens, openGarden })(
	GardenScreen,
);
