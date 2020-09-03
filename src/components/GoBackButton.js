import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Spacer from './Spacer';
import { withNavigation } from '@react-navigation/compat';
import Ionicons from 'react-native-vector-icons/Ionicons';

const GoBackButton = ({ navigation, nav }) => {
  console.log(nav);

  return (
    <View style={styles.backButton}>
      <TouchableOpacity onPress={() => navigation.navigate(nav)}>
        <Ionicons name={'arrow-back'} size={30} color="#8DC34A" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    margin: 15,
  },
});

export default withNavigation(GoBackButton);
