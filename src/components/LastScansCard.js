import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/FontAwesome';
import React from 'react';
import { withNavigation } from '@react-navigation/compat';

const LastScansCard = ({ iconName, navigation, nav, headerText, data }) => (
	<View style={styles.containerStyle}>
		<TouchableOpacity
			style={styles.cardStyle}
			onPress={() => navigation.navigate(nav, { data })}
			activeOpacity={0.5}
		>
			<View
				style={{
					flexDirection: 'row',
				}}
			>
				<Icon name={iconName} size={30} color="#8DC34A" />
				<Text style={styles.cardHeaderText}>{headerText}</Text>
			</View>
		</TouchableOpacity>
		<View style={{ marginLeft: 5, marginTop: 10 }}>
			<FlatList
				horizontal
				keyExtractor={(item) => item.id}
				data={data}
				refreshing={false}
				renderItem={({ item }) => {
					const imageUrl = item.image_url;
					const imageUrlReady = imageUrl
						.replace(
							'/var/leafs_files/upload/',
							'https://leafs-app.lab-code.com/upload/',
						)
						.replace(
							'\\\\172.16.0.5\\Share\\leafs_files\\upload\\',
							'https://leafs-app.lab-code.com/upload/',
						);

					return <FastImage style={styles.image} source={{ uri: imageUrlReady }} />;
				}}
			/>
		</View>
	</View>
);

const styles = StyleSheet.create({
	containerStyle: {
		marginHorizontal: 15,
		marginBottom: 15,
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
	},

	cardStyle: {
		paddingTop: 10,
		paddingHorizontal: 10,
	},
	cardHeaderText: {
		textAlignVertical: 'center',
		marginLeft: 20,
		fontSize: 20,
		color: '#8DC34A',
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
		color: '#FF9800',
		fontSize: 15,
	},

	image: {
		width: 75,
		height: 75,
		marginBottom: 10,
		marginHorizontal: 5,
		borderColor: 'red',
		borderRadius: 5,
	},
});

export default withNavigation(LastScansCard);
