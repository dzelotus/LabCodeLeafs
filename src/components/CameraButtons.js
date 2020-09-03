import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { withNavigation } from '@react-navigation/compat';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CameraButtons = ({ photo, flash, flashType, camera }) => {
  return (
    <View
      style={{
        justifyContent: 'flex-end',
        margin: 15,
        height: 40,
      }}>
      <View
        style={{
          alignSelf: 'flex-start',
          position: 'absolute',
        }}>
        <TouchableOpacity onPress={camera}>
          <Ionicons name={'camera-reverse'} size={50} color="white" />
        </TouchableOpacity>
      </View>
      <View
        style={{
          alignSelf: 'center',

          position: 'absolute',
        }}>
        <TouchableOpacity onPress={photo}>
          <Ionicons name={'ios-radio-button-on'} size={65} color="white" />
        </TouchableOpacity>
      </View>
      <View
        style={{
          alignSelf: 'flex-end',

          position: 'absolute',
        }}>
        <TouchableOpacity onPress={flash}>
          {flashType ? (
            <Ionicons name={'ios-flash'} size={50} color="white" />
          ) : (
            <Ionicons name={'ios-flash-off'} size={50} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cameraButtons: {
    backgroundColor: 'transparent',
    flexDirection: 'row',

    alignItems: 'flex-end',
    marginBottom: 15,
    marginHorizontal: 10,
    borderColor: 'green',
    borderWidth: 1,
  },
});

export default withNavigation(CameraButtons);
