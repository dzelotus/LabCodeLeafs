import React from 'react';
import { FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';

const Gallery = ({ data, navigation, moreLoading }) => (
	<>
		<FlatList
			style={{ flex: 1, flexDirection: 'row' }}
			data={data}
			keyExtractor={(item) => item.uri}
			onEndReached={moreLoading}
			onEndReachedThreshold={4}
			renderItem={({ item }) => (
				<TouchableOpacity
					onPress={() =>
						navigation.navigate('ScanPhoto', {
							img: item,
						})
					}
				>
					<Image style={styles.image} source={{ uri: item.uri }} />
				</TouchableOpacity>
			)}
		/>
	</>
);

const styles = StyleSheet.create({
	image: {
		width: 75,
		height: 75,
		borderWidth: 1,
		borderColor: 'red',
		marginBottom: 10,
		marginHorizontal: 5,
	},
});

export default Gallery;
