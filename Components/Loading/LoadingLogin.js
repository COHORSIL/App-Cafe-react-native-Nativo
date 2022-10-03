import React from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { Overlay } from "react-native-elements";
import LottieTex from "../Lottie/LottieTextLoading";

export default function LoadingLogin(props) {
    const { isVisible, text } = props;
    return (
      <Overlay
        isVisible={isVisible}
        windowBackgroundColor="#FFF"
        overlayBackgroundColor="transparent"
        style={styles.overlay}
      >
        <View style={styles.view}>
          <LottieTex />
          {text && <Text style={styles.text}>{text}</Text>}
        </View>
      </Overlay>
    );
  }
  
  const styles = StyleSheet.create({
    overlay: {
      height: "100vh",
      width: "100vh",
      backgroundColor: "#FFF",
      borderColor: "#00a680",
      color: "#000000",
      overlayColor: "#FFF",
      borderWidth: 2,
      borderRadius: 10,
      textAlign: "center",
      alignItems: "center",
      justifyContent: "center",
      display: "flex",
      flexDirection: "column",
      position: "absolute",
      opacity: 0.9,
    },
    view: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      color: "#000000",
      marginTop: 10,
    },
  });
  