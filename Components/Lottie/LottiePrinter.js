import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";



export default function LottiePrinter() {

  return (
    <>
        <LottieView
          style={styles.lottie}
          source={require("../../assets/lottlie/74215-printing.json")}
          autoPlay
        />
    </>
  );
}

const styles = StyleSheet.create({
  lottie: {
    width: 120,
    height: 120,
  },
  conten: {
    flexDirection: "row",
    position: "relative",
    marginLeft: "auto",
    marginRight: "auto",
  },
  numv: {
    fontSize: 40,
    fontWeight: "900",
    marginTop: 40,
    marginLeft: 18,
    color: "red",
  },
  numv2: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
