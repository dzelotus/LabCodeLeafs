import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { withNavigation } from '@react-navigation/compat';

const BadgeIcon = () => (
	<View>
		<FontAwesome name="chevron-right" size={20} color="#FF9800" />
	</View>
);

const FavoritesCard = ({ iconName, navigation, nav, headerText, itemText }) => (
	<View style={styles.containerStyle}>
		<TouchableOpacity
			onPress={() => navigation.navigate(nav)}
			style={styles.cardStyle}
			activeOpacity={0.5}
		>
			<View
				style={{
					flexDirection: 'row',
				}}
			>
				<View>
					<FontAwesome name={iconName} size={30} color="#8DC34A" />
				</View>
				<Text style={styles.cardHeaderText}>{headerText}</Text>
			</View>

			<TouchableOpacity style={styles.cardItem}>
				<Text style={styles.textItem}>Последнее добавленное в{itemText}1</Text>
				<BadgeIcon />
			</TouchableOpacity>

			<TouchableOpacity style={styles.cardItem}>
				<Text style={styles.textItem}>Последнее добавленное в{itemText} 2</Text>
				<BadgeIcon />
			</TouchableOpacity>

			<TouchableOpacity style={styles.lastCardItem}>
				<Text style={styles.textItem}>Последнее добавленное в{itemText} 3</Text>
				<BadgeIcon />
			</TouchableOpacity>
		</TouchableOpacity>
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
});

export default withNavigation(FavoritesCard);
