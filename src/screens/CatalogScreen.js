import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
	View,
	StyleSheet,
	Text,
	FlatList,
	TouchableOpacity,
	TextInput,
	Image,
	ActivityIndicator,
} from 'react-native';
import { fetchCatalog } from '../actions/CatalogActions';

const CatalogScreen = (props) => {
	const [term, setTerm] = useState('');

	useEffect(() => {
		props.navigation.addListener('focus', () => {
			props.fetchCatalog();
		});
	}, []);

	const { data, loading } = props;

	if (loading) {
		return <ActivityIndicator size="large" color="#8DC34A" />;
	}
	return (
		<View style={{ flex: 1 }}>
			<View style={styles.inputContainer}>
				<TextInput
					autoCapitalize="none"
					placeholder="Поиск по каталогу"
					style={styles.inputStyle}
					value={term}
					onChangeText={(newTerm) => setTerm(newTerm)}
					onEndEditing={() => console.log('submitted')}
				/>
			</View>
			<View style={{ marginBottom: 60 }}>
				<FlatList
					data={data}
					keyExtractor={(item) => item.name}
					renderItem={({ item }) => (
						<TouchableOpacity
							onPress={() =>
								props.navigation.navigate('CatalogItem', {
									item,
								})
							}
							style={{
								flex: 1,
								flexDirection: 'row',
								margin: 10,
							}}
						>
							<Image
								style={styles.imageStyle}
								source={{
									uri: 'https://2ch.hk/test/src/22583/14918417781080.png',
								}}
							/>
							<View
								style={{
									flexDirection: 'column',
									justifyContent: 'center',
									marginLeft: 15,
									flex: 1,
								}}
							>
								<Text style={styles.nameStyle}>{item.name}</Text>
								<Text style={styles.alternativeNameStyle}>
									{item.alternativeName}
								</Text>
							</View>
						</TouchableOpacity>
					)}
				/>
			</View>
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
		height: 80,
		width: 80,
		borderRadius: 40,
		borderWidth: 1,
		borderColor: 'gray',
		overflow: 'hidden',
	},
	nameStyle: {
		fontSize: 20,
	},
	alternativeNameStyle: { color: 'green' },
});

const mapStateToProps = ({ catalog }) => {
	const { data, loading } = catalog;
	return { data, loading };
};

export default connect(mapStateToProps, { fetchCatalog })(CatalogScreen);
