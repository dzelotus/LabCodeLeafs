/* eslint-disable consistent-return */
import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { withNavigation } from '@react-navigation/compat';

const NewsCard = ({ iconName, navigation, nav, headerText, newsData }) => {
	const rendTitles = () => {
		if (newsData) {
			const slicedData = newsData.slice(0, 3);
			return slicedData.map((item) => {
				return (
					<TouchableOpacity
						key={item.id}
						style={{ flexDirection: 'row', justifyContent: 'space-between' }}
						onPress={() =>
							navigation.navigate('News', {
								screen: 'Article',
								params: { data: item },
							})
						}
					>
						<Text
							style={{
								color: '#EB9156',
								marginBottom: 5,
								fontSize: 18,
								flex: 30,
							}}
						>
							{item.title}
						</Text>
						<FontAwesome
							name="chevron-right"
							size={20}
							color="#379683"
							style={{ flex: 1, paddingRight: 5 }}
						/>
					</TouchableOpacity>
				);
			});
		}
	};

	return (
		<View style={styles.containerStyle}>
			<TouchableOpacity
				onPress={() => navigation.navigate(nav, { data: newsData })}
				style={styles.cardStyle}
				activeOpacity={0.5}
			>
				<View
					style={{
						flexDirection: 'row',
					}}
				>
					<View>
						<FontAwesome name={iconName} size={30} color="#379683" />
					</View>
					<Text style={styles.cardHeaderText}>{headerText}</Text>
				</View>
				<View style={{ marginVertical: 5 }}>{rendTitles()}</View>
			</TouchableOpacity>
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
		color: '#FF9800',
		fontSize: 15,
	},
});

export default withNavigation(NewsCard);
