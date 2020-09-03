import React from 'react';
import { View, StyleSheet, Text, FlatList, Button, Image } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

const ItemScreen = ({ navigation }) => {
	const list = navigation.state.params.item;

	return (
		<View style={{ flex: 1 }}>
			<View>
				<FlatList
					horizontal
					showsHorizontalScrollIndicator={false}
					data={list.img}
					keyExtractor={(img) => img}
					renderItem={({ item }) => {
						return <Image style={styles.image} source={{ uri: item }} />;
					}}
				/>
			</View>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
					margin: 10,
				}}>
				<TouchableOpacity style={styles.buttons}>
					<Text style={{ textAlign: 'center' }}>Добавить в избранное</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.buttons}>
					<Text style={{ textAlign: 'center' }}>Добавить в желаемое</Text>
				</TouchableOpacity>
			</View>

			<Text style={styles.itemTitle}>{list.name}</Text>
			<ScrollView>
				<Text style={styles.itemInfo}>{list.info}</Text>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	image: {
		width: 250,
		height: 250,
		borderWidth: 1,
		borderColor: 'red',
		marginBottom: 10,
		marginHorizontal: 10,
	},

	itemTitle: {
		textAlign: 'center',
		fontSize: 30,
		fontWeight: 'bold',
		borderWidth: 1,
		borderColor: 'red',
		marginLeft: 10,
		marginRight: 10,
	},

	itemInfo: {
		fontSize: 18,
		borderWidth: 1,
		borderColor: 'red',
		marginLeft: 10,
		marginRight: 10,
	},
	buttons: {
		borderColor: 'red',
		borderWidth: 1,
	},
});

export default ItemScreen;
