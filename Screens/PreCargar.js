import React, { useState, useEffect, useRef, useContext } from "react";
import { StyleSheet, View, Platform, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, sesion } from "../Utils/Api";
import { refreshGlobal } from "../Context/Context";



export default function PreCargar({ navigation, route }) {
  const { setuserInfo } = route.params;


  const { refreshAPP } = useContext(refreshGlobal);




  const tokenlogin = async () => {
    const value = await AsyncStorage.getItem("token");

    if (value !== null) {
      setuserInfo({
        token: value,
      });
      navigation.navigate("Navigation");
      // let url = sesion();

      // fetch(url, {
      //   method: "GET",
      //   Headers: { "Content-Type": "application/json" },
      // })
      //   .then((response) => response.json())
      //   .then((responseJson) => {
      //     if (responseJson.status === 1) {
      //       console.log("sesion iniciada");
      //       navigation.navigate("Navigation");
      //     }
      //     if (responseJson.status === 2) {
      //       console.log("sin logearse");
      //       AsyncStorage.removeItem("token");

      //       navigation.navigate("Login");
      //     } else {
      //       // navigation.navigate("Conexion");
      //     }
      //   })
      //   .catch((error) => {
      //     navigation.navigate("Login");
      //   });
    } else {
      navigation.navigate("Login");
    }
  };

  useEffect(() => {
    tokenlogin();
  }, [refreshAPP]);

  return <View></View>;
}

const styles = StyleSheet.create({});