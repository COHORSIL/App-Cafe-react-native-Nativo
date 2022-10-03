import React from "react";
import { StyleSheet, Text, View } from "react-native";
import LottieView from "lottie-react-native";

export default function LottieLoadinSinConexion() {
  return (
    <LottieView
      style={styles.lottie}
      source={require("../../assets/lottlie/79231-loading.json")}
      autoPlay
    />
  );
}

const styles = StyleSheet.create({
  lottie: {
    width: 40,
    height: 40,
  },
});
