import React from "react";
import { StyleSheet, Text, View } from "react-native";
import LottieView from "lottie-react-native";

export default function LottieCargando() {
  return (
    <View style={styles.conten}>
      <LottieView
        style={styles.lottie}
        source={require("../../assets/lottlie/78999-data-scanning.json")}
        autoPlay
      />
    </View>
  );
}

const styles = StyleSheet.create({
  lottie: {
    width: 100,
    height: 100,
  },
  conten: {
    position: "relative",
    marginLeft: "auto",
    marginRight: "auto",
  },
});
