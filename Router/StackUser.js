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
import {sesion, Beneficio} from '../Utils/Api';
import jwt_decode from 'jwt-decode';
import {IconButton} from 'react-native-paper';
import {BluetoothManager} from 'tp-react-native-bluetooth-printer';
import ModalImpresora from '../Components/ModalImpresora/ModalImpresora';
import {getDBConnection, insertTask} from '../Utils/db';
import {ClienteNotas} from '../Utils/Api';
import {ScrollView} from 'react-native-gesture-handler';

export default function StackUser({navigation}) {
  let Foto = 'https://picsum.photos/500';

  const {token} = Usuario();

  const [DataUser, setDataUser] = useState([]);
  const [Benefi, setBenefi] = useState([]);
  const [Estado, setEstado] = useState('Verificando');
  const [Impresora, setImpresora] = useState(false);
  const [SincronizarUser, setSincronizarUser] = useState([]);
  const [EditadosClien, setEditadosClien] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [Update1, setUpdate1] = useState(false);

  useEffect(() => {
    if (token) {
      setDataUser(jwt_decode(token));
    }

    Beneficios();
    ImpresoraLocal();
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

  const Beneficios = async () => {
    const value = await AsyncStorage.getItem('Beneficio');

    if (value !== null) {
      setBenefi(JSON.parse(value));
    } else {
    }
  };

  const ImpresoraLocal = async () => {
    const value = await AsyncStorage.getItem('print');
    let print = JSON.parse(value);
    if (value !== null) {
      BluetoothManager.connect(print.address) // the device address scanned.
        .then(
          s => {
            // console.log('Conectada');
            setEstado(true);
          },
          e => {
            // console.log('Desconectada');
            setEstado(false);
          },
        );
      return;
    }
  };

  useEffect(() => {
    let url = ClienteNotas();
    let options1 = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    };

    fetch(`${url}&nuevos`, options1)
      .then(res => res.json())
      .then(result => {
        if (size(result.ClientesNuevos) > 0) {
          setSincronizarUser(result.ClientesNuevos);
        } else {
          ToastAndroid.show(`No hay Clientes Nuevos`, 3000);
          setSincronizarUser([]);
        }
      })
      .catch(error => {
        console.log('error fetch get Cliente', error);
        ToastAndroid.show(`Revisa tu conexion de Internet`, 3000);
      });

    Editados();
  }, [Loading, Update1]);

  const Editados = () => {
    let url = ClienteNotas();
    let options1 = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    };

    fetch(`${url}&editados`, options1)
      .then(res => res.json())
      .then(result => {
        if (size(result.ClientesEditados) > 0) {
          setEditadosClien(result.ClientesEditados);
        } else {
          ToastAndroid.show(`No hay Clientes Editados`, 3000);
          setEditadosClien([]);
        }
      })
      .catch(error => {
        console.log('error fetch get Cliente', error);
        ToastAndroid.show(`Revisa tu conexion de Internet`, 3000);
      });
  };

  const SincronizarClientes = () => {
    setLoading(false);

    if (size(SincronizarUser) > 0) {
      let url = ClienteNotas();
      let options1 = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      };

      fetch(`${url}&nuevos&sincronizar=true`, options1)
        .then(res => res.json())
        .then(result => {
          if (size(result.ClientesNuevos) > 0) {
            result.ClientesNuevos.map((item, index) => {
              Agregar(item, index, result);
            });
          }
        })
        .catch(error => {
          console.log('error fetch get Cliente', error);
        });
    } else {
      let url = ClienteNotas();
      let options1 = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      };

      fetch(`${url}&editados&sincronizar=true`, options1)
        .then(res => res.json())
        .then(result => {
          if (size(result.ClientesEditados) > 0) {
            result.ClientesEditados.map((item, index) => {
              AgregarEditados(item, index, result);
            });
          }
        })
        .catch(error => {
          console.log('error fetch get Cliente', error);
        });
    }
  };

  const Agregar = async (item, index, result) => {
    try {
      const db = await getDBConnection();
      await insertTask(db, item);
      console.log('se Sincronizaron los Clientes Nuevos');
      db.close;
    } catch (error) {
      console.log(error);
    }

    if (index == result.ClientesNuevos.length - 1) {
      setLoading(true);
      ToastAndroid.show(`se Sincronizaron los Clientes Nuevos`, 3000);
    }
  };

  const AgregarEditados = async (item, index, result) => {
    const db = await getDBConnection();
    const UpdateQuery = `DELETE FROM Clientes WHERE Codigo LIKE '${item.Codigo}'`;
    await db.executeSql(UpdateQuery);

    try {
      const db = await getDBConnection();
      await insertTask(db, item);

      db.close;
    } catch (error) {
      console.log(error);
    }

    if (index == result.ClientesEditados.length - 1) {
      setLoading(true);
      ToastAndroid.show(`se Sincronizaron los Clientes editados`, 3000);
      setEditadosClien([]);
    }
  };

  return (
    <>
      <ModalImpresora Impresora={Impresora} setImpresora={setImpresora} />
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
                        name="gmail"
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

                  <View>
                    <View style={styles.rowt}>
                      <Icon
                        style={styles.iconbtr}
                        type="material-community"
                        name="warehouse"
                        size={25}
                      />
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: 'bold',
                          paddingLeft: 5,
                          color: 'black',
                        }}>
                        Beneficio
                      </Text>
                    </View>
                    {size(Benefi) > 0 ? (
                      <Text style={{textAlign: 'center', color: 'black'}}>
                        {Benefi.Nombre}
                      </Text>
                    ) : (
                      <Text style={{textAlign: 'center'}}>{0}</Text>
                    )}
                  </View>
                </View>
                <View style={{position: 'absolute', right: 15}}>
                  <IconButton
                    icon="update"
                    size={35}
                    onPress={() => setUpdate1(!Update1)}
                  />
                </View>
              </View>
            </View>

            <ScrollView>
              <TouchableOpacity
                onPress={() => {
                  setImpresora(true);
                  ImpresoraLocal();
                }}
                style={{
                  display: 'flex',
                  alignContent: 'center',
                  alignItems: 'center',
                  marginTop: 20,
                  borderTopWidth: 1,
                  borderStyle: 'solid',
                  marginRight: 60,
                  marginLeft: 60,
                  borderColor: '#CFD0CF',
                }}>
                <Text style={{fontWeight: 'bold', color: 'black'}}>
                  Configuracion de Impresora
                </Text>
                <IconButton
                  icon="printer"
                  size={35}
                  color={
                    Estado == true
                      ? '#337F52'
                      : Estado == false
                      ? 'red'
                      : '#C8CD3F'
                  }
                />
                <Text>
                  {Estado == true
                    ? 'Conectada'
                    : Estado == false
                    ? 'Desconectada'
                    : Estado}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => SincronizarClientes()}
                style={{
                  display: 'flex',
                  alignContent: 'center',
                  alignItems: 'center',
                  marginTop: 20,
                  borderTopWidth: 1,
                  borderStyle: 'solid',
                  marginRight: 60,
                  marginLeft: 60,
                  borderColor: '#CFD0CF',
                }}>
                <Text style={{fontWeight: 'bold', color: 'black'}}>
                  Sincronizar Clientes
                </Text>
                <IconButton
                  icon={
                    size(SincronizarUser) > 0 || size(EditadosClien) > 0
                      ? 'account-convert'
                      : 'account-check-outline'
                  }
                  size={35}
                  color={size(SincronizarUser) > 0 || size(EditadosClien) > 0? 'red' : '#3E8341'}
                />
                <Text>
                  {size(SincronizarUser) > 0 || size(EditadosClien) > 0
                    ? SincronizarUser.length + EditadosClien.length
                    : 0}
                </Text>
              </TouchableOpacity>
            </ScrollView>

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
