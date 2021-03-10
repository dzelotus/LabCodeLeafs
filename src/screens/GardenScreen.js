/* eslint-disable no-else-return */
/* eslint-disable operator-linebreak */
/* eslint-disable consistent-return */
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, ScrollView, Alert } from 'react-native';
import nodeApi from '../api/nodeApi';
import GardenWithPlantsCard from '../components/GardenWithPlantsCard';
import AddGardenModal from '../components/AddGardenModal';
import NotAuthUser from '../components/NotAuthUser';

const GardenScreen = (props) => {
	const { navigation } = props;

	const [loading, setLoading] = useState({
		screenLoading: false,
		buttonLoading: false,
		itemLoading: false,
	});
	const [gardenData, setGardenData] = useState(null);
	const [isVerified, setIsVerified] = useState(null);
	const [isAuth, setIsAuth] = useState(null);

	const checkVerify = async () => {
		nodeApi
			.get('user_authentication')
			.then((response) => {
				console.log('RESP', response.data.data);
				const token = response.data.data.hasValidTokens;
				const verify = response.data.data.isVerified;
				setIsVerified(response.data.data.isVerified);
				verifyAlert(token, verify);
			})
			.catch((error) => console.log('USER AUTH ERR', error));
	};

	const verifyAlert = (token, verify) => {
		console.log('token', token, 'verify', verify);
		if (!verify && !token) {
			console.log('ALERT FOR LINK');
			Alert.alert(
				'Внимание',
				'Для работы с данным разделом, требуется подтверждение электронной почты. Отправить ссылку для подтверждения?',
				[
					{
						text: 'Отмена',
					},
					{ text: 'Отправить', onPress: () => getNewVerifyLink() },
				],
			);
		} else if (token && !verify) {
			console.log('ALERT ABOUT LINK');
			Alert.alert(
				'Внимание',
				'Для работы с данным разделом, требуется подтверждение электронной почты. Ссылка уже была отправлена на Вашу электронную почту',
			);
		}
	};

	const getNewVerifyLink = () => {
		console.log('GET VERIFY LINK');
		setLoading({ screenLoading: true });
		nodeApi
			.post('/verify', {})
			.then((response) => {
				console.log('VERIFY RESPONSE', response.data);
				setLoading({ screenLoading: false });
				Alert.alert('', response.data.message);
			})
			.catch((error) => {
				console.log(error.response.data);
				setLoading({ screenLoading: false });
				Alert.alert('', error.response.data.message);
			});
	};

	const getGardens = () => {
		console.log('GET GARDENS START');
		if (gardenData) {
			setLoading({ itemLoading: true });
		} else {
			setLoading({ screenLoading: true });
		}

		nodeApi
			.get('/garden')
			.then((response) => {
				console.log('GET GARDENS RESPONSE', response);
				setIsAuth(true);
				setGardenData(response.data.data);
				setLoading({ screenLoading: false, itemLoading: false, buttonLoading: false });
			})
			.catch((error) => {
				console.log(error.response);
				setIsAuth(false);
				setLoading({ screenLoading: false, itemLoading: false, buttonLoading: false });
			});
	};

	useEffect(() => {
		const getFocus = navigation.addListener('focus', () => {
			getGardens();
			checkVerify();
		});

		return getFocus;
	}, []);

	const Indicator = () => (
		<View>
			<ActivityIndicator size="large" color="#379683" />
		</View>
	);
	const gardenRender = () => {
		if (gardenData) {
			return gardenData.map((item) => {
				console.log('GD ITE', item);
				return (
					<GardenWithPlantsCard
						data={item}
						getGardens={() => getGardens()}
						nav={navigation}
						key={item.id}
					/>
				);
			});
		}
	};

	// eslint-disable-next-line react/destructuring-assignment
	if (loading.screenLoading === true) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white' }}>
				<Indicator />
			</View>
		);
	} else if (!isAuth) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white' }}>
				<NotAuthUser />
			</View>
		);
	}

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: 'white',
			}}
		>
			<ScrollView keyboardShouldPersistTaps="always">
				{gardenRender()}
				{loading.itemLoading ? <Indicator /> : null}
				{isVerified ? <AddGardenModal getGardens={() => getGardens()} /> : null}
			</ScrollView>
		</View>
	);
};

export default GardenScreen;
