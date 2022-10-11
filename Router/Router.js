import { StyleSheet, Text, View } from 'react-native'
import React, {useState, useEffect, useContext} from 'react'
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Stack1 from './Stack1';
import Stack2 from './Stack2';
import StackUser from './StackUser';
import Feather from "react-native-vector-icons/Feather";
import {getDBConnection} from '../Utils/db';
import { refreshGlobal } from '../Context/Context';


const Tab = createMaterialBottomTabNavigator();

export default function Router() {
  const [Clien, setClien] = useState([]);
  const {RefreshConsulta} = useContext(refreshGlobal);


  useEffect(() => {
    PendientesClientes();
  }, [RefreshConsulta]);

  const PendientesClientes = async () => {
    setClien([]);
    const db = await getDBConnection();
    try {
      const task = [];
      const results = await db.executeSql(
        `SELECT * FROM Clientes WHERE estado LIKE '%1%'`,
      );
      results.forEach(result => {
        for (let index = 0; index < result.rows.length; index++) {
          task.push(result.rows.item(index));
        }
      });
      setClien(task);
    } catch (error) {
      console.error(error);
      throw Error('Error al obtener los datos !!!');
    }
  };
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
          tabBarLabel: "Home",
          tabBarColor: "#FFFFFF",
          tabBarBadge: Clien.length == 0 ? null : Clien.length,
          tabBarIcon: ({ color }) => (
            <Feather name="home" color="#3BA6CF" size={20} />
          ),
        }}
      />
  

      <Tab.Screen
        name="Stack2"
        component={Stack2}
        options={{
          tabBarLabel: "Estadisticas",
          tabBarColor: "#FFFFFF",
          tabBarIcon: ({ color }) => (
            <Feather name="bar-chart-2" color="#3BA6CF" size={20} />
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