import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {View} from 'react-native-animatable';
import {StyleSheet} from 'react-native';

//Component
import Pantalla1 from '../Components/Pantalla1/Pantalla1';
import BeneficioUva from '../Components/Pantalla1/BeneficioUva/BeneficioUva';
import AddCliente from '../Components/Pantalla1/AddCliente/AddCliente';
import Pendientes from '../Components/Pantalla1/Pendientes/Pendientes';

const Stack = createStackNavigator();

export default function Stack1() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#F1F1F1',
        },
        headerTintColor: '#292828',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen
        name="Pantalla1"
        component={Pantalla1}
        options={({route, navigation}) => ({
          headerLeft: null,
          title: 'Home',
        })}
      />

      <Stack.Screen
        name="BeneficioUva"
        component={BeneficioUva}
        options={({route, navigation}) => ({
          title: 'Beneficio Cafe Uva',
        })}
      />

      <Stack.Screen
        name="AddCliente"
        component={AddCliente}
        options={({route, navigation}) => ({
          title: 'Agregar Cliente / Socio',
        })}
      />

      <Stack.Screen
        name="Pendientes"
        component={Pendientes}
        options={({route, navigation}) => ({
          title: 'Enviar Pendientes',
        })}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
