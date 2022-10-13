import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import LottieView from 'lottie-react-native';

export default function LottieLoadinNotas() {
  return (
    <>
      <LottieView
        style={styles.lottie}
        source={require('../../assets/lottlie/99297-loading-files.json')}
        autoPlay
      />
    </>
  );
}

const styles = StyleSheet.create({
  lottie: {
    width: 100,
    height: 100,
  },
  conten: {
    flexDirection: 'row',
    position: 'relative',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  numv: {
    fontSize: 40,
    fontWeight: '900',
    marginTop: 40,
    marginLeft: 18,
    color: 'red',
  },
  numv2: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
