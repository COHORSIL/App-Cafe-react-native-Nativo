import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import {size} from 'lodash';
import {Button, Icon} from 'react-native-elements';
import Usuario from '../Hooks/Usuario';
import {soporte} from '../Utils/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {sesion} from '../Utils/Api';
import jwt_decode from 'jwt-decode';

export default function StackUser({navigation}) {
  let Foto = 'https://picsum.photos/500';

  const {foto, departamento, user, idUser, token} = Usuario();

  const [DataUser, setDataUser] = useState([]);
  console.log(DataUser);



  useEffect(() => {
    if (token) {
      setDataUser(jwt_decode(token));
    }
  }, [token]);

  const logout = () => {
    let url = `${sesion()}&close=${1}`;

    fetch(url, {
      method: 'GET',
      Headers: {'Content-Type': 'application/json'},
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status === 1) {
          console.log('sesion cerrada');
          AsyncStorage.removeItem('token');
          AsyncStorage.removeItem('tokenId');
          navigation.navigate('Login');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };




  return (
    <>
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Image
          style={styles.coverImage}
          source={Foto ? {uri: Foto} : require('../assets/camara.png')}
        />

        {size(DataUser.data) > 0 ? (
          <>
            <View style={styles.profileContainer}>
              <View>
                <View style={styles.profileImageView}>
                  {size(DataUser.data.foto) > 0 ? (
                    <Image
                      style={styles.profileImage}
                      source={
                        DataUser.data.foto
                          ? {uri: DataUser.data.foto}
                          : require('../assets/camara.png')
                      }
                    />
                  ) : (
                    <Image
                      style={styles.profileImage}
                      source={
                        'https://picsum.photos/500'
                          ? {uri: 'https://picsum.photos/500'}
                          : require('../assets/camara.png')
                      }
                    />
                  )}

                  <View>
                    <Text style={styles.nombre}>{DataUser.data.usuario}</Text>
                  </View>

                  <View>
                    <View style={styles.rowt}>
                      <Icon
                        style={styles.iconbtr}
                        type="material-community"
                        name="home-city-outline"
                        size={25}
                      />
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: 'bold',
                          paddingLeft: 5,
                          color: 'black',
                        }}>
                        Departamento
                      </Text>
                    </View>
                    {size(DataUser.data.departamento) > 0 ? (
                      <Text style={{textAlign: 'center', color: 'black'}}>
                        {DataUser.data.departamento.trim()}
                      </Text>
                    ) : (
                      <Text style={{textAlign: 'center'}}>{0}</Text>
                    )}
                  </View>

                  <View>
                    <View style={styles.rowt}>
                      <Icon
                        style={styles.iconbtr}
                        type="material-community"
                        name="home-city-outline"
                        size={25}
                      />
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: 'bold',
                          paddingLeft: 5,
                          color: 'black',
                        }}>
                        Correo
                      </Text>
                    </View>
                    {size(DataUser.data.email) > 0 ? (
                      <Text style={{textAlign: 'center', color: 'black'}}>
                        {DataUser.data.email.trim()}
                      </Text>
                    ) : (
                      <Text style={{textAlign: 'center'}}>{0}</Text>
                    )}
                  </View>

                  {/* <View style={styles.rowt}>
                  <Icon
                    style={styles.iconbtr}
                    type="material-community"
                    name="calendar-clock"
                    size={25}
                  />
                  <Text
                    style={{ fontSize: 14, fontWeight: "bold", paddingLeft: 5 }}
                  >
                    Solicitudes Pendientes
                  </Text>
                </View>
                <Text style={{ margin: "auto" }}>{pend.length}</Text> */}

                  {/* <View style={styles.rowt}>
                  <Icon
                    style={styles.iconbtr}
                    type="material-community"
                    name="bookmark-check"
                    size={25}
                  />
                  <Text
                    style={{ fontSize: 14, fontWeight: "bold", paddingLeft: 5 }}
                  >
                    Solicitudes Corregidas
                  </Text>
                </View>
                <Text style={{ margin: "auto" }}>{Result.length}</Text> */}
                </View>
              </View>
            </View>

            <View style={styles.interactButtonsView}>
              <TouchableOpacity style={styles.interactButton} onPress={logout}>
                <Text style={styles.interactButtonText}>Cerrar Sesion</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : null}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  coverImage: {height: 300, width: '100%'},
  coverImage2: {height: 150, width: '100%'},
  profileContainer: {
    backgroundColor: '#fff',
    marginTop: -100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  profileImageView: {alignItems: 'center', marginTop: -50},
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#fff',
  },
  nameAndBioView: {alignItems: 'center', marginTop: 10},
  userFullName: {fontSize: 26},
  userBio: {
    fontSize: 20,
    color: '#333',
    marginTop: 4,
  },
  interactionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  like: {
    position: 'absolute',
    right: 25,
    top: 10,
  },
  like2: {
    position: 'absolute',
    left: 25,
    top: 10,
  },
  messageInputView: {
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: 14,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  messageInput: {
    height: 40,
    flex: 1,
    paddingHorizontal: 10,
  },
  messageSendView: {
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  comen: {
    fontSize: 15,
  },
  iconButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    marginTop: 10,
    paddingLeft: '35%',
  },
  comen2: {
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: 25,
    marginTop: 70,
  },
  nombre2: {
    position: 'absolute',
    right: 20,
    top: 60,
  },
  userFullName2: {
    borderBottomWidth: 1,
    borderStyle: 'solid',
    fontSize: 25,
  },
  rowt: {
    flexDirection: 'row',
    marginTop: 25,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  iconbtr: {
    paddingLeft: 5,
  },
  nombre: {
    fontWeight: 'bold',
    fontSize: 17,
    color: 'black',
  },
  depa: {
    marginTop: 30,
    fontSize: 17,
    color: 'black',
  },
  interactButtonsView: {
    flexDirection: 'row',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  interactButton: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: '#4b7bec',
    margin: 5,
    borderRadius: 4,
  },
  interactButtonText: {
    color: '#fff',
    fontSize: 18,
    paddingVertical: 6,
  },
});
