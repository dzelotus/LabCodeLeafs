import React from 'react';
import { View, StyleSheet } from 'react-native';

const BorderLine = ({ children }) => <View style={styles.borderLine}>{children}</View>;

const styles = StyleSheet.create({
	borderLine: {
		borderColor: '#8DC34A',
		borderWidth: 1,
		borderRadius: 2,
		marginHorizontal: 15,
		backgroundColor: '#8DC34A',
		height: 3,
	},
});

export default BorderLine;
