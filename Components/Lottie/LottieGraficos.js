import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import LottieView from 'lottie-react-native';

export default function LottieGraficos({navigation, Clien}) {
  return (
    <>

        <LottieView
          style={styles.lottie}
          source={require('../../assets/lottlie/8822-graficos-aleatorios-1.json')}
          autoPlay
        />
 
    </>
  );
}

const styles = StyleSheet.create({
  lottie: {
    width: 250,
    height: 250,
    marginRight: "auto",
    marginLeft: "auto",
    marginTop: "10%",
  },
});
