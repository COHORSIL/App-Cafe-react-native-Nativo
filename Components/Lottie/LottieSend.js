import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import LottieView from 'lottie-react-native';

export default function LottieSend({navigation, Clien}) {
  return (
    <>

        <LottieView
          style={styles.lottie}
          source={require('../../assets/lottlie/11859-add.json')}
          autoPlay
        />
 
    </>
  );
}

const styles = StyleSheet.create({
  lottie: {
    width: 150,
    height: 150,
    marginRight: "auto",
    marginLeft: "auto",
    marginTop: "10%",
  },
});
