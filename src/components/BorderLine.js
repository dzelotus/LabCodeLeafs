import React from 'react';
import { View, StyleSheet } from 'react-native';

const BorderLine = ({ children }) => <View style={styles.borderLine}>{children}</View>;

const styles = StyleSheet.create({
	borderLine: {
		borderColor: '#379683',
		borderWidth: 1,
		borderRadius: 2,
		marginHorizontal: 15,
		backgroundColor: '#379683',
		height: 3,
	},
});

export default BorderLine;
