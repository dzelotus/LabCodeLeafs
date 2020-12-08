import { Text, View } from 'react-native';

import React from 'react';

const AboutUsScreen = () => (
	<View
		style={{
			marginHorizontal: 5,
			marginTop: 10,
			marginBottom: 5,

			flex: 1,
		}}
	>
		<View style={{ flex: 1 }}>
			<Text style={{ fontSize: 18, color: '#379683', textAlign: 'center' }}>Плант-док</Text>
			<Text style={{ fontSize: 18, color: '#379683', textAlign: 'center' }}>
				перспективный программный продукт в области защиты растений
			</Text>
		</View>
		<View style={{ alignSelf: 'center', flex: 1, justifyContent: 'flex-end' }}>
			<Text style={{ textAlign: 'center' }}>ООО Лабаратория Кода - www.lab-code.com</Text>
			<Text style={{ textAlign: 'center' }}>Пермь, 2020 год</Text>
		</View>
	</View>
);

export default AboutUsScreen;
