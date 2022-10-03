import React from "react";
import { StyleSheet, Text, View } from "react-native";
import LottieView from "lottie-react-native";

export default function LottieDelete() {
  return (
    <View style={styles.conten}>
      <LottieView
        style={styles.lottie}
        source={require("../../assets/lottlie/68051-delete.json")}
        autoPlay
      />
    </View>
  );
}

const styles = StyleSheet.create({
  lottie: {
    width: 150,
    height: 150,
  },
  conten: {
    position: "relative",
    marginLeft: "auto",
    marginRight: "auto",
  },
});
