/* eslint-disable no-else-return */
/* eslint-disable operator-linebreak */
/* eslint-disable consistent-return */
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { useForm, Controller } from 'react-hook-form';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import nodeApi from '../api/nodeApi';
import GardenWithPlantsCard from '../components/GardenWithPlantsCard';

const GardenScreen = (props) => {
	const { navigation } = props;
	console.log('GARDEN SCREEN', props);

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
		if (gardenData) {
			setLoading({ itemLoading: true });
		} else {
			setLoading({ screenLoading: true });
		}

		nodeApi
			.get('/garden')
			.then((response) => {
				setGardenData(response.data.data);
				setLoading({ screenLoading: false, itemLoading: false, buttonLoading: false });
			})
			.catch((error) => {
				console.log(error.response);
				setLoading({ screenLoading: false, itemLoading: false, buttonLoading: false });
			});
	};

	const getCsrf = () => {
		nodeApi
			.get('/garden/new')
			.then((response) => {
				setCsrf(response.data.csrfToken);
				setLoading({ buttonLoading: false });
			})
			.catch((e) => console.log('ERR', e.response));
	};

	useEffect(() => {
		getGardens();
	}, []);

	const createGarden = (gardenName, gardenDescription) => {
		setLoading({ itemLoading: true, buttonLoading: true });
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
				setLoading({ itemLoading: false, buttonLoading: false });
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
						<View style={{ position: 'absolute', bottom: 0, right: 0 }}>
							<TouchableOpacity
								style={styles.addGardenBtnPressed}
								onPress={() => {
									setAddGardenButtonSwitcher(!addGardenButtonSwitcher);
									getCsrf();
									setGardenEditData(null);
								}}
							>
								<Icon name="close" size={30} color="#379683" />
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
						color="#379683"
						style={{ transform: [{ rotate: '45deg' }] }}
					/>
				</TouchableOpacity>
			</View>
		);
	};

	const Indicator = () => (
		<View>
			<ActivityIndicator size="large" color="#379683" />
		</View>
	);

	const loadingButton = () => {
		if (loading.buttonLoading) {
			return <Indicator />;
		}
		return (
			<Button
				buttonStyle={{ backgroundColor: '#379683', height: 40 }}
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
						getGardens={(deleteGarden) => getGardens(deleteGarden)}
						editGarden={(id) => {
							editGarden(id);
						}}
						nav={navigation}
						key={item.id}
					/>
				);
			});
		}
	};

	return (
		<View style={{ flex: 1 }}>
			<ScrollView>
				{gardenRender()}
				{loading.itemLoading ? <Indicator /> : null}
			</ScrollView>
			{addGarden()}
		</View>
	);
};

const styles = StyleSheet.create({
	addGardenBtnNormal: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		borderRadius: 50,
		backgroundColor: '#fff',
		alignItems: 'center',
		width: 60,
		height: 60,
		justifyContent: 'center',
		borderColor: '#379683',
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
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		borderRadius: 10,
		borderColor: '#000',
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		margin: 5,
		marginBottom: 10,
		padding: 10,
	},
});

export default GardenScreen;
