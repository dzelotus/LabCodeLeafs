/* eslint-disable no-else-return */
/* eslint-disable operator-linebreak */
/* eslint-disable consistent-return */
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, ScrollView } from 'react-native';
import nodeApi from '../api/nodeApi';
import GardenWithPlantsCard from '../components/GardenWithPlantsCard';
import AddGardenModal from '../components/AddGardenModal';

const GardenScreen = (props) => {
	const { navigation } = props;

	const [loading, setLoading] = useState({
		screenLoading: false,
		buttonLoading: false,
		itemLoading: false,
	});

	const [gardenData, setGardenData] = useState(null);

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
				setGardenData(response.data.data);
				setLoading({ screenLoading: false, itemLoading: false, buttonLoading: false });
			})
			.catch((error) => {
				console.log(error.response);
				setLoading({ screenLoading: false, itemLoading: false, buttonLoading: false });
			});
	};

	useEffect(() => {
		getGardens();
	}, []);

	const Indicator = () => (
		<View>
			<ActivityIndicator size="large" color="#379683" />
		</View>
	);

	// eslint-disable-next-line react/destructuring-assignment
	if (loading.screenLoading === true) {
		return <Indicator />;
	}

	const gardenRender = () => {
		if (gardenData) {
			return gardenData.map((item) => {
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

	return (
		<View
			style={{
				flex: 1,
			}}
		>
			<ScrollView>
				{gardenRender()}
				{loading.itemLoading ? <Indicator /> : null}
				<AddGardenModal getGardens={() => getGardens()} />
			</ScrollView>
		</View>
	);
};

export default GardenScreen;
