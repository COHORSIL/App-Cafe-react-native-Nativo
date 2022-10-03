import React from "react";
import { StyleSheet, Text, View } from "react-native";
import LottieView from "lottie-react-native";

export default function LottieCorazon() {
  return (
    <View style={styles.conten}>
      <LottieView
        style={styles.lottie}
        source={require("../../assets/lottlie/66200-heart-lottie-animation.json")}
        autoPlay
      />
    </View>
  );
}

const styles = StyleSheet.create({
  lottie: {
    width: 35,
    height: 35,
    marginLeft: 7,
    marginBottom: -5,
    marginTop: -4,
  },
  conten: {
    marginBottom: -5,
  },
});
