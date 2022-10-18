import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import LottieView from 'lottie-react-native';

export default function LottieSend({navigation, Clien}) {
  return (
    <>

        <LottieView
          style={styles.lottie}
          source={require('../../assets/lottlie/51371-laptop-floating-animation-w-servers.json')}
          autoPlay
        />
 
    </>
  );
}

const styles = StyleSheet.create({
  lottie: {
    width: 100,
    height: 100,
    marginRight: "auto",
    marginLeft: "auto",
    marginTop: "10%",
  },
});
