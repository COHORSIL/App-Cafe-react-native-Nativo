import React from "react";
import { StyleSheet, Text, View } from "react-native";
import LottieView from "lottie-react-native";

export default function LottieLoading() {
  return (
    <View style={styles.conten}>
      <LottieView
        style={styles.lottie}
        source={require("../../assets/lottlie/87986-data-analysis.json")}
        autoPlay
      />
      {/* <Text style={styles.text}>Cargando...</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  lottie: {
    width: 200,
    height: 300,
    marginRight: "auto",
    marginLeft: "auto",
    marginTop: "20%",
  },
  text: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 20,
  },
});
