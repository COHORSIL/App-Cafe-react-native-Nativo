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