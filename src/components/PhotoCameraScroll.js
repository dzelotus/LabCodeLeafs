import React from 'react';
import { FlatList, TouchableOpacity, StyleSheet, View, Image } from 'react-native';
import { withNavigation } from '@react-navigation/compat';

const PhotoCameraScroll = ({ data, navigation, moreLoading }) => (
	<View
		style={{
			backgroundColor: 'transparent',
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'flex-end',
			marginBottom: 15,
			height: 100,
		}}
	>
		<FlatList
			horizontal
			data={data}
			keyExtractor={(item) => item.node.image.uri}
			onEndReached={moreLoading}
			onEndReachedThreshold={4}
			renderItem={({ item }) => {
				const imageUrl = item.node.image.uri;

				return (
					<TouchableOpacity
						onPress={() =>
							navigation.navigate('ScanPhoto', {
								img: item.node.image,
							})
						}
					>
						<Image style={styles.image} source={{ uri: imageUrl }} key={imageUrl} />
					</TouchableOpacity>
				);
			}}
		/>
	</View>
);

const styles = StyleSheet.create({
	image: {
		width: 75,
		height: 75,
		marginBottom: 10,
		marginHorizontal: 5,
	},
});

export default withNavigation(PhotoCameraScroll);
