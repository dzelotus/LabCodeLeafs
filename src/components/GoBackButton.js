import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { withNavigation } from '@react-navigation/compat';
import Ionicons from 'react-native-vector-icons/Ionicons';

const GoBackButton = ({ navigation, nav }) => {
	console.log(nav);

	return (
		<TouchableOpacity onPress={() => navigation.navigate(nav)} style={styles.backButton}>
			<Ionicons name="arrow-back" size={40} color="#379683" style={{ zIndex: 500 }} />
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
});

export default withNavigation(GoBackButton);
