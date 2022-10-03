import React from "react";
import { StyleSheet, Text, View } from "react-native";
import LottieView from "lottie-react-native";

export default function LottiePlus() {
  return (
    <View style={styles.conten}>
      <LottieView
        style={styles.lottie}
        source={require("../../assets/lottlie/78243-plus.json")}
        autoPlay
      />
    </View>
  );
}

const styles = StyleSheet.create({
  lottie: {
    width: 80,
    height: 80,
  },
});
