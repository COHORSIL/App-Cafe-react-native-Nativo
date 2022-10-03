import React from "react";
import { StyleSheet, Text, View } from "react-native";
import LottieView from "lottie-react-native";

export default function LottieSinInternet() {
  return (
    <View style={styles.conten}>
      <LottieView
        style={styles.lottie}
        source={require("../../assets/lottlie/12955-no-internet-connection-empty-state.json")}
        autoPlay
      />
    </View>
  );
}

const styles = StyleSheet.create({
  lottie: {
    width: 200,
    height: 200,
  },
  conten: {
    position: "relative",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "50%",
  },
});
