import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";



export default function LottieWalk({ navigation, Clien }) {

  return (
    <>
      <Text style={styles.numv2}>Hay Datos pendientes</Text>
      <Text style={styles.numv2}>Por Subir</Text>
      <TouchableOpacity
        style={styles.conten}
        onPress={() => navigation.navigate("Pendientes")}
      >
        <LottieView
          style={styles.lottie}
          source={require("../../assets/lottlie/54778-files-imported.json")}
          autoPlay
        />
        <Text style={styles.numv}>{Clien.length}</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  lottie: {
    width: 150,
    height: 150,
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
