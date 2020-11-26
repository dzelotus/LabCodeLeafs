/* eslint-disable no-else-return */
/* eslint-disable operator-linebreak */
/* eslint-disable consistent-return */
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import nodeApi from '../api/nodeApi';
import GardenWithPlantsCard from '../components/GardenWithPlantsCard';
/* import nodeApi from '../api/nodeApi'; */

import {
	inputChange,
	getCsrf,
	getGardens,
	openGarden,
	addButtonSwitch,
	createGarden,
	deleteGarden,
	editGarden,
	updateGarden,
	getPlantsData,
	clearState,
	openPlants,
	setPlantSwitcher,
} from '../actions/GardenActions';

const GardenScreen = (props) => {
	const { navigation } = props;

	const [loading, setLoading] = useState({
		screenLoading: false,
		buttonLoading: false,
		itemLoading: false,
	});
	const [csrf, setCsrf] = useState(null);
	const [gardenData, setGardenData] = useState(null);
	const [gardenEditData, setGardenEditData] = useState(null);
	const [addGardenButtonSwitcher, setAddGardenButtonSwitcher] = useState(false);
	const [buttonAction, setButtonAction] = useState(null);
	const { control, handleSubmit } = useForm();

	const getGardens = () => {
		setLoading({ screenLoading: true });
		nodeApi
			.get('/garden')
			.then((response) => {
				setGardenData(response.data.data);
				setLoading({ screenLoading: false });
			})
			.catch((error) => {
				console.log(error.response);
			});
	};

	const getCsrf = () => {
		nodeApi
			.get('/garden/new')
			.then((response) => {
				setCsrf(response.data.csrfToken);
			})
			.catch((e) => console.log('ERR', e.response));
	};

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			getGardens();
		});
		return unsubscribe;
	}, [navigation]);

	const createGarden = (gardenName, gardenDescription) => {
		nodeApi
			.post('/garden', {
				name: gardenName,
				description: gardenDescription,
				_csrf: csrf,
			})
			.then(() => {
				getGardens();
				setAddGardenButtonSwitcher(false);
			})
			.catch((error) => {
				console.log('CREATE ERROR', error.response);
			});
	};

	const updateGarden = (gardenName, gardenDescription) => {
		const gardenId = gardenEditData.id;
		nodeApi
			.put(`garden/${gardenId}`, {
				name: gardenName,
				description: gardenDescription,
				_csrf: csrf,
			})
			.then((response) => {
				console.log(response);
				getGardens();
				setAddGardenButtonSwitcher(false);
			})
			.catch((error) => {
				console.log(error.response);
			});
	};

	const onSubmit = (data) => {
		console.log('DATA', data);
		if (buttonAction === 'create') {
			createGarden(data.gardenName_input, data.gardenDescription_input);
		} else if (buttonAction === 'edit') {
			updateGarden(data.gardenName_input, data.gardenDescription_input);
		}
	};

	const addGarden = () => {
		if (addGardenButtonSwitcher) {
			return (
				<View style={styles.addContainerStyle}>
					<View style={styles.addGardenCard}>
						<Controller
							control={control}
							render={({ onChange, onBlur, value }) => (
								<Input
									label="Название Огорода"
									onChangeText={onChange}
									onBlur={onBlur}
									defaultValue={value}
								/>
							)}
							name="gardenName_input"
							defaultValue={gardenEditData ? gardenEditData.name : ''}
							key={gardenEditData ? 'gardenName_loaded' : 'gardenName_loading'}
						/>
						<Controller
							control={control}
							render={({ onChange, onBlur, value }) => (
								<Input
									label="Описание"
									onChangeText={onChange}
									onBlur={onBlur}
									defaultValue={value}
								/>
							)}
							name="gardenDescription_input"
							defaultValue={gardenEditData ? gardenEditData.description : ''}
							key={
								gardenEditData
									? 'gardenDescription_loaded'
									: 'gardenDescription_loading'
							}
						/>
						{loadingButton()}
						<View style={{ position: 'absolute', bottom: 0, right: 0, borderWidth: 1 }}>
							<TouchableOpacity
								style={styles.addGardenBtnPressed}
								onPress={() => {
									setAddGardenButtonSwitcher(!addGardenButtonSwitcher);
									getCsrf();
									setGardenEditData(null);
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
						setAddGardenButtonSwitcher(!addGardenButtonSwitcher);
						setButtonAction('create');
						getCsrf();
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
		if (loading.buttonLoading) {
			return <Indicator />;
		}
		return (
			<Button
				title={buttonAction === 'edit' ? 'Редактировать Огород' : 'Создать Огород'}
				onPress={handleSubmit(onSubmit)}
			/>
		);
	};

	// eslint-disable-next-line react/destructuring-assignment
	if (loading.screenLoading === true) {
		return <Indicator />;
	}

	const editGarden = (gardenId) => {
		setAddGardenButtonSwitcher(!addGardenButtonSwitcher);
		setButtonAction('edit');
		getCsrf();
		setLoading({ buttonLoading: true });
		if (addGardenButtonSwitcher) {
			setGardenEditData(null);
		} else {
			nodeApi
				.get(`garden/${gardenId}/edit`)
				.then((response) => {
					setGardenEditData(response.data.data);
					setLoading({ buttonLoading: false });
				})
				.catch((error) => console.log(error));
		}
	};

	const gardenRender = () => {
		if (gardenData) {
			return gardenData.map((item) => {
				return (
					<GardenWithPlantsCard
						data={item}
						nav={navigation}
						getGardens={() => getGardens()}
						editGarden={(id) => {
							editGarden(id);
						}}
						key={item.id}
					/>
				);
			});
		}
	};

	return (
		<View style={{ flex: 1 }}>
			<ScrollView>{gardenRender()}</ScrollView>
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

		openGardenId,
		addBtnSwitch,
		buttonLoading,
		itemLoading,
		itemOpenIndex,
		editButton,

		plantsData,
		plantsLoading,
		plantItemOpenSwitcher,
	} = garden;
	return {
		gardenName,
		gardenDescription,
		csrf,
		screenLoading,

		openGardenId,
		addBtnSwitch,
		buttonLoading,
		itemLoading,
		itemOpenIndex,
		editButton,

		plantsData,
		plantsLoading,
		plantItemOpenSwitcher,
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
		marginHorizontal: 10,
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
		marginHorizontal: 10,
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
		marginHorizontal: 10,
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
		marginBottom: 5,
	},
	addPlantBtn: {
		marginHorizontal: 15,
		marginVertical: 10,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 12,
		},
		shadowOpacity: 0.58,
		shadowRadius: 16.0,

		elevation: 3,
		borderRadius: 10,
		borderColor: '#8DC34A',
		borderWidth: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		height: 40,
		justifyContent: 'center',
	},
	rowDirection: {
		flexDirection: 'row',
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

	editGarden,
	updateGarden,
	getPlantsData,
	clearState,
	openPlants,
	setPlantSwitcher,
})(GardenScreen);
