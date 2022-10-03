import {StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { refreshGlobal } from './Context/Context';
import { TokenNotifications } from "./Context/TokenNotifications";
import Context from "./Utils/Contex";
import { Provider as PaperProvider } from "react-native-paper";
import Navigation from './Router/Router';

//Components
import PreCargar from './Screens/PreCargar';
import LoginPru from "./Screens/LoginPru";

const Stack = createStackNavigator();

export default function App() {
  //context
  const data = {
    user: null,
    idUser: null,
    foto: null,
    departamento: null,
  };

  const [userInfo, setuserInfo] = useState(data);
  const [refreshApi, setrefreshApi] = useState(false);
  const [Tok, setTok] = useState([]);
  const [refreshAPP, setrefreshAPP] = useState(false);

  return (

    <refreshGlobal.Provider
      value={{
        refreshApi,
        setrefreshApi,
        refreshAPP,
        setrefreshAPP,
      }}
    >
      <TokenNotifications.Provider
        value={{
          Tok,
          setTok,
        }}
      >
        <Context.Provider value={userInfo}>
          <PaperProvider>
            <NavigationContainer>
              <Stack.Navigator
                screenOptions={{
                  headerShown: false,
                  headerTransparent: true,
                }}
              >
                <Stack.Screen
                  name="preCargar"
                  component={PreCargar}
                  initialParams={{
                    setuserInfo: setuserInfo,
                  }}
                />

                <Stack.Screen
                  name="Login"
                  component={LoginPru}
                  initialParams={{ setuserInfo: setuserInfo }}
                />
                <Stack.Screen name="Navigation" component={Navigation} />
                {/* <Stack.Screen name="Conexion" component={Conexion} /> */}
              </Stack.Navigator>
            </NavigationContainer>
          </PaperProvider>
        </Context.Provider>
      </TokenNotifications.Provider>
    </refreshGlobal.Provider>
 
  );
}

const styles = StyleSheet.create({});
