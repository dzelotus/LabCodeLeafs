import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import diseaseData from '../catalog';

const CatalogJsonScreen = (props) => {
	return (
		<View>
			<FlatList
				data={diseaseData}
				keyExtractor={(item) => item.id.toString()}
				renderItem={(item) => {
					console.log('ITEM', item);
					return (
						<TouchableOpacity
							style={{ flex: 1, flexDirection: 'row', margin: 10 }}
							onPress={() =>
								props.navigation.navigate('CatalogItem', {
									data: item.item,
								})
							}
						>
							<Image source={item.item.previewImage} style={styles.imageStyle} />
							<View
								style={{
									flexDirection: 'column',
									justifyContent: 'center',
									marginLeft: 15,
									flex: 1,
								}}
							>
								<Text style={styles.nameStyle}>{item.item.diseaseName}</Text>
								<Text style={styles.alternativeNameStyle}>{item.item.synonym}</Text>
							</View>
						</TouchableOpacity>
					);
				}}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	inputStyle: {
		color: '#000',
		paddingRight: 5,
		paddingLeft: 5,
		fontSize: 16,
		lineHeight: 23,
	},
	inputContainer: {
		borderBottomColor: '#7FC844',
		borderBottomWidth: 1,
		marginVertical: 5,
		marginLeft: 10,
		marginRight: 10,
	},
	imageStyle: {
		height: 100,
		width: 100,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: 'gray',
		overflow: 'hidden',
	},
	nameStyle: {
		fontSize: 20,
		color: '#EB9156',
	},
	alternativeNameStyle: { color: '#379683' },
});

export default CatalogJsonScreen;
