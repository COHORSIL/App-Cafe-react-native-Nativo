import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Keyboard,
  ToastAndroid,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { useTheme } from "react-native-paper";
import BackgroundImage from "../assets/pexels-anthony-157520.jpg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { refreshGlobal } from "../Context/Context";
import LoadingLogin from "../Components/Loading/LoadingLogin";
import { User } from "../Utils/Api";

// npm install react-native-animatable
import * as Animatable from "react-native-animatable";

export default function LoginPru(props) {
  const { navigation, route } = props;
  const { setuserInfo } = route.params;
  const { refreshAPP, setrefreshAPP } = useContext(refreshGlobal);



  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        setrefreshAPP(!refreshAPP);
      }),
    [navigation]
  );

  if (!BackgroundImage) {
    return <Text>Loading...</Text>;
  }

  const [datos, setDatos] = useState({
    nombre: "",
    password: "",
    secureTextEntry: true,
    check_textInputChange: false,
  });

  const [userid, setUserid] = useState("");

  //leer inputs
  const leer = (e, name) => {
    setDatos({
      ...datos,
      [name]: e.nativeEvent.text,
      check_textInputChange: true,
    });
  };

  //Carga de pantalla
  const [isVisible, setIsVisible] = useState(false);

  const submiPost = async () => {
    setIsVisible(true);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: datos.nombre,
        clave: datos.password,
      }),
    };
    var url = User();
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status === 1) {
          setuserInfo({
            token: `Bearer ${responseJson.token}`,
          });
          AsyncStorage.setItem("token", `Bearer ${responseJson.token}`);
          setDatos({
            nombre: "",
            password: "",
          });
          navigation.navigate("Navigation");

          setIsVisible(false);
          ToastAndroid.show("Inicio de sesion Correctamente!", 3000);
        }
        if (responseJson.status === 2) {
    
          ToastAndroid.show("Usuario Incorrecto!", 3000);
          setIsVisible(false);
        } else {
          ToastAndroid.show("Usuario Incorrecto!", 3000);
          setIsVisible(false);
        }
      })
      .catch((error) => {
        ToastAndroid.show(`${error}`, 3000);
        setIsVisible(false);
      });
  };


  const { colors } = useTheme();

  const updateSecureTextEntry = () => {
    setDatos({
      ...datos,
      secureTextEntry: !datos.secureTextEntry,
    });
  };




  return (
    <>
      <LoadingLogin isVisible={isVisible} text="Iniciando Sesion" />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <View style={{ flex: 1 }}>
            <Image
              style={{ flex: 1, width: null, marginTop: -500 }}
              source={BackgroundImage}
            />
          </View>
          <Animatable.Text
            style={styles.titleText}
            animation="fadeInUp"
            delay={1200}
          >
            COHORSIL
          </Animatable.Text>
          <Animatable.Text
            style={styles.titleText2}
            animation="fadeInUp"
            delay={1400}
          >
            Beneficio
          </Animatable.Text>

          <View style={styles.bottomView}>
            <Text style={styles.loginText}>Login</Text>

            <View style={styles.action}>
              
              <Feather name="users" color="#3BA6CF" size={20} />
              <TextInput
                autoCapitalize="none"
                placeholderTextColor="#666666"
                placeholder="Usuario"
                style={styles.textInput}
                onChange={(e) => leer(e, "nombre")}
                value={datos.nombre}
              />
              <Animatable.View animation="bounceIn">
                {datos.check_textInputChange ? (
                  <Animatable.View animation="bounceIn">
                    <Feather name="check-circle" color="green" size={20} />
                  </Animatable.View>
                ) : null}
              </Animatable.View>
            </View>

            <View style={styles.action}>
              <Feather name="lock" color="#3BA6CF" size={20} />
              <TextInput
                placeholderTextColor="#666666"
                secureTextEntry={datos.secureTextEntry ? true : false}
                style={styles.textInput}
                autoCapitalize="none"
                placeholder="Contraseña"
                onChange={(e) => leer(e, "password")}
                value={datos.password}
              />
              <TouchableOpacity onPress={updateSecureTextEntry}>
                {datos.secureTextEntry ? (
                  <Feather name="eye-off" color="grey" size={20} />
                ) : (
                  <Feather name="eye" color="grey" size={20} />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={submiPost}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleText: {
    position: "absolute",
    top: Dimensions.get("screen").height * 0.1,
    alignSelf: "center",
    color: "#fff",
    fontSize: 60,
    shadowColor: "black",
    shadowOffset: {
      width: 8,
      height: 8,
    },

    shadowRadius: 1,
  },
  titleText2: {
    position: "absolute",
    top: Dimensions.get("screen").height * 0.2,
    alignSelf: "center",
    color: "#fff",
    fontSize: 60,
    shadowColor: "black",
    shadowOffset: {
      width: 8,
      height: 8,
    },

    shadowRadius: 1,
  },
  bottomView: {
    backgroundColor: "#fff",
    opacity: 0.95,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  loginText: {
    fontSize: 24,
    marginTop: 12,
    marginBottom: 4,
    color: "black"
  },
  inputView: {
    height: 40,
    borderRadius: 10,
    backgroundColor: "#f1f3f6",
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  inputIcon: {
    paddingHorizontal: 8,
  },
  input: {
    height: 40,
    flex: 1,

    fontSize: 16,
    color: "#333",
  },
  loginButton: {
    backgroundColor: "#2496B8",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  loginButtonText: {
    color: "#fff",

    alignSelf: "center",
    fontSize: 18,
  },
  registerText: {
    alignSelf: "center",
    marginTop: 12,

    fontSize: 16,
  },
  fpText: {
    marginTop: 10,
    alignSelf: "flex-end",

    fontSize: 16,
    color: "#5352ed",
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
    height: 40,
    fontSize: 16,
  },
});
