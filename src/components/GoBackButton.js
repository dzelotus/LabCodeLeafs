/* Универсальная экранная кнопка "Назад" */

/* NPM */
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { withNavigation } from '@react-navigation/compat';
import Ionicons from 'react-native-vector-icons/Ionicons';

const GoBackButton = ({ navigation, nav }) => {
	console.log(nav);

	return (
		<TouchableOpacity onPress={() => navigation.navigate(nav)} style={styles.backButton}>
			<Ionicons name="arrow-back" size={40} color="#379683" style={styles.iconZIndex} />
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	backButton: {
		marginTop: 15,
		borderWidth: 2,
		borderColor: '#379683',
		borderRadius: 60,
		width: 50,
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'white',
	},
	iconZIndex: { zIndex: 500 },
});

export default withNavigation(GoBackButton);
