import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Stack1 from './Stack1';
import Stack2 from './Stack2';
import StackUser from './StackUser';
import Feather from "react-native-vector-icons/Feather";


const Tab = createMaterialBottomTabNavigator();

export default function Router() {
  return (
    <Tab.Navigator
      shifting={true}
      initialRouteName="Stack1"
      activeColor="#181818"
      labelStyle={{ fontSize: 12 }}
      style={{ backgroundColor: "#009387" }}
    >
      <Tab.Screen
        name="Stack1"
        component={Stack1}
        options={{
          tabBarLabel: "Catalogo",
          tabBarColor: "#FFFFFF",
          tabBarIcon: ({ color }) => (
            <Feather name="users" color="#3BA6CF" size={20} />
          ),
        }}
      />
  

      <Tab.Screen
        name="Stack2"
        component={Stack2}
        options={{
          tabBarLabel: "Centros",
          tabBarColor: "#FFFFFF",
          tabBarIcon: ({ color }) => (
            <Feather name="users" color="#3BA6CF" size={20} />
          ),
        }}
      />


<Tab.Screen
        name="StackUser"
        component={StackUser}
        options={{
          tabBarLabel: "Cuenta",
          tabBarColor: "#FFFFFF",
          tabBarIcon: ({ color }) => (
            <Feather name="log-out" color="#3BA6CF" size={20} />
          ),
        }}
      />

      {/* <Tab.Screen
        name="CuentaStack"
        component={CuentaStack}
        options={{
          tabBarLabel: "Cuenta",
          tabBarColor: "#FFFFFF",
          tabBarIcon: ({ color }) => (
            <Feather name="users" color="#3BA6CF" size={20} />
          ),
        }}
      /> */}
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({})