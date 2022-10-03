import React from "react";
import { StyleSheet, Text, View } from "react-native";
import LottieView from "lottie-react-native";

export default function LottieSinComentarios() {
  return (
    <>
      <View style={styles.conten}>
        <LottieView
          style={styles.lottie}
          source={require("../../assets/lottlie/59839-commnet-animation (1).json")}
          autoPlay
        />
      </View>
      <View style={styles.conten}>
        <Text style={styles.nom}>Agrega una Respuesta...</Text>
      </View>
    </>
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
  nom: {
    fontSize: 16,
  },
  nom2: {
    fontSize: 16,
    paddingLeft: 25,
  },
});
