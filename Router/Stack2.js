import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {View} from 'react-native-animatable';
import {StyleSheet} from 'react-native';

//Components
import Pantalla2 from '../Components/Pantalla2/Pantalla2';

const Stack = createStackNavigator();

export default function Stack2() {
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
        name="Pantalla2"
        component={Pantalla2}
        options={({route, navigation}) => ({
          headerLeft: null,
          title: 'Estadisticas',
        })}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
