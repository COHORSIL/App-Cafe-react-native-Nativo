import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import LottieSend from '../../Lottie/LottieSend';
import {getDBConnection} from '../../../Utils/db';
import {refreshGlobal} from '../../../Context/Context';
import {IconButton} from 'react-native-paper';
import {size} from 'lodash';
import {Icon} from 'react-native-elements';
import {ClienteNotas, Notas} from '../../../Utils/Api';
import Usuario from '../../../Hooks/Usuario';
import LoadingLogin from '../../Loading/LoadingLogin';

export default function Pendientes({navigation}) {
  const {RefreshConsulta, setRefreshConsulta} = useContext(refreshGlobal);
  const [Clien, setClien] = useState([]);
  const [GetNotasData, setGetNotasData] = useState([]);
  const [isVisible, setisVisible] = useState(false);
  const [NotaData, setNotaData] = useState([]);
  const {token} = Usuario();

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

  const PendientesNotas = async () => {
    const db = await getDBConnection();
    try {
      const task = [];
      const results = await db.executeSql(
        `SELECT * FROM Notas WHERE Estado !=0`,
      );

      results.forEach(result => {
        for (let index = 0; index < result.rows.length; index++) {
          task.push(result.rows.item(index));
        }
      });
      setNotaData(task);

      let Array = [];

      if (size(task) > 0) {
        task.forEach(function (item, index) {
          Array.push({
            cliente: JSON.parse(item.Cliente),
            Beneficio: item.Beneficio,
            Marca: item.Marca,
            Pesos: item.Pesos,
            Tipo: item.Tipo,
            SumaLibras: item.SumaLibras,
            Muestras: item.Muestras,
            SumaSacos: item.SumaSacos,
            PrecioFijado: item.PrecioFijado,
            Altura: item.Altura,
            EstadoCafe: JSON.parse(item.Descuentos),
            Fecha: item.FechaCreacion,
            Estado: item.Estado,
            Observacion: item.Observacion,
            id: item.id,
            Correlativo: item.Correlativo,
          });
        });

        setGetNotasData(Array);
        // console.log(Array);
      }
    } catch (error) {
      console.error(error);

      throw Error('Error al obtener los datos !!!');
    }
  };

  useEffect(() => {
    PendientesClientes();
    PendientesNotas();
  }, [RefreshConsulta]);

  const deleCliente = async item => {
    setRefreshConsulta(true);
    const db = await getDBConnection();
    const deleteQuery = `DELETE from Clientes where rowid = ${item.id}`;
    await db.executeSql(deleteQuery);
    setRefreshConsulta(false);
  };

  const Enviar = () => {
    setRefreshConsulta(true);
    setisVisible(true);
    {
      Clien.map((item, index) => {
        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({
            identidad: item.Identidad,
            nombre: item.Nombre,
            direccion: item.direccion,
            telefono: item.telefono,
            genero: item.genero === 'Masculino' ? 1 : 2,
          }),
        };
        var url = ClienteNotas();
        fetch(url, requestOptions)
          .then(response => response.json())
          .then(responseJson => {
            if (responseJson.status === 1) {
              EstadoCeroCliente(item, index, Clien);
              console.log(responseJson);
              return;
            }

            if (responseJson.status === 2) {
              ToastAndroid.show(
                `${responseJson.descripcion} de ${item.Nombre} Eliminalo para poder enviar`,
                3000,
              );
              setisVisible(false);
              return;
            }
          })
          .catch(error => {
            console.error(error);
            setisVisible(false);
            ToastAndroid.show(`Revisa tu conexion de Internet`, 3000);
          });
      });
    }

    if (size(GetNotasData) > 0) {
      NotasPost();
    }

    // setTimeout(() => {
    //   ToastAndroid.show('se agregaron los datos correctamente', 3000);
    //   navigation.navigate('Pantalla1');
    // }, 2000);
  };

  const NotasPost = async () => {
    setisVisible(true);
    setRefreshConsulta(true);
    {
      NotaData.map((item, index) => {
        const requestOptions = {
          method: Number(item.Estado) === 1 ? 'POST' : 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body:
            Number(item.Estado) === 1
              ? JSON.stringify({
                  item,
                })
              : JSON.stringify({
                  id: item.Correlativo,
                  beneficio: item.Beneficio,
                }),
        };
        var url = Notas();
        fetch(url, requestOptions)
          .then(response => response.json())
          .then(responseJson => {
            if (responseJson.status === 1) {
              EstadoCeroNotas(item, index, NotaData);
              return;
            }

            if (responseJson.status === 2) {
              ToastAndroid.show(`${responseJson.descripcion}`, 3000);
              setisVisible(false);
              return;
            }
          })
          .catch(error => {
            console.error(error);
            setisVisible(false);
            ToastAndroid.show(`Revisa tu conexion de Internet  ${error}`, 3000);
          });
      });
    }
  };

  const EstadoCeroCliente = async (item, index, Clien) => {
    const db = await getDBConnection();
    const UpdateQuery = `UPDATE Clientes set estado = '0' where rowid = ${item.id}`;
    await db.executeSql(UpdateQuery);
    if (index == Clien.length - 1) {
      setRefreshConsulta(false);
      setisVisible(false);
      setClien([]);
    }
    console.log('se actualizo el estado del cliente');
  };

  const EstadoCeroNotas = async (item, index, NotaData) => {
    // if (Number(item.Estado) === 1) {
    //   const db = await getDBConnection();
    //   const UpdateQuery = `UPDATE Notas set Estado = '0' WHERE id = ${item.id};`;
    //   await db.executeSql(UpdateQuery);
    // }

    // if (Number(item.Estado) === 2) {
    //   // const db = await getDBConnection();
    //   // const deleteQuery = `DELETE from Notas where rowid = ${item.id}`;
    //   // await db.executeSql(deleteQuery);

    //   const db = await getDBConnection();
    //   const UpdateQuery = `UPDATE Notas set Estado = '0' WHERE id = ${item.id};`;
    //   await db.executeSql(UpdateQuery);
    // }

    const db = await getDBConnection();
    const UpdateQuery = `UPDATE Notas set Estado = '0' WHERE id = ${item.id};`;
    await db.executeSql(UpdateQuery);

    if (index == NotaData.length - 1) {
      setRefreshConsulta(false);
      setisVisible(false);
      setGetNotasData([]);
    }

    console.log('Se cambio el estado de la nota');
  };

  return (
    <>
      <LoadingLogin isVisible={isVisible} text="Enviando Datos" />
      <View style={{maxHeight: '40%'}}>
        <View
          style={{
            flexDirection: 'row',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
          <Icon
            type="material-community"
            name="account-plus"
            size={25}
            color="#BD5F4B"
          />
          <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>
            Clientes Creados
          </Text>
        </View>

        <ScrollView>
          {size(Clien) > 0 ? (
            <>
              {Clien.map((item, index) => (
                <View key={index} style={styles.conet2}>
                  <View style={{width: '80%'}}>
                    <View style={{flexDirection: 'row'}}>
                      <Icon
                        type="material-community"
                        name="account"
                        size={20}
                        color="#BD5F4B"
                      />
                      <Text style={{textAlign: 'left', fontWeight: 'bold'}}>
                        Cliente: {item.Nombre}
                      </Text>
                    </View>

                    <Text style={{textAlign: 'left', fontWeight: 'bold'}}>
                      Identidad: {item.Identidad}
                    </Text>
                  </View>

                  <View style={{width: '20%'}}>
                    <IconButton
                      icon="delete"
                      size={25}
                      onPress={() => deleCliente(item)}
                      color="red"
                    />
                  </View>
                </View>
              ))}
            </>
          ) : null}
        </ScrollView>
      </View>

      <View style={{maxHeight: '40%'}}>
        <View
          style={{
            flexDirection: 'row',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
          <Icon
            type="material-community"
            name="newspaper-variant-outline"
            size={25}
            color="#BD5F4B"
          />
          <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>
            Notas Creadas
          </Text>
        </View>
        {size(GetNotasData) > 0 ? (
          <>
            {GetNotasData.map((item, index) => (
              <View
                key={index}
                style={
                  Number(item.Estado) === 1
                    ? {
                        height: 60,
                        marginRight: 15,
                        marginLeft: 15,
                        backgroundColor: 'white',
                        borderRadius: 15,
                        padding: 5,
                        marginBottom: 45,
                      }
                    : {
                        height: 60,
                        marginRight: 15,
                        marginLeft: 15,
                        backgroundColor: '#D79692',
                        borderRadius: 15,
                        padding: 5,
                        marginBottom: 35,
                      }
                }>
                <View style={{width: '100%'}}>
                  <Text style={{textAlign: 'left', fontWeight: 'bold'}}>
                    Nombre: {item.cliente.Nombre}
                  </Text>
                  <Text style={{textAlign: 'left', fontWeight: 'bold'}}>
                    Correlativo: {item.Correlativo}
                  </Text>

                  {Number(item.Estado) === 2 ? (
                    <Text
                      style={{
                        textAlign: 'left',
                        fontWeight: 'bold',
                        position: 'absolute',
                        right: 15,
                      }}>
                      Anulada
                    </Text>
                  ) : null}
                </View>

                <View style={{flexDirection: 'row', marginTop: 5}}>
                  <View style={styles.socialLoginTouchable}>
                    <View style={{flexDirection: 'row'}}>
                      <Icon
                        name="sack"
                        type="material-community"
                        color="#F16529"
                      />
                      <Text>Total Sacos</Text>
                    </View>
                    <Text>{item.SumaSacos}</Text>
                  </View>

                  <View style={styles.socialLoginTouchable}>
                    <View style={{flexDirection: 'row'}}>
                      <Icon
                        name="weight-pound"
                        type="material-community"
                        color="#F16529"
                      />
                      <Text>Total Libras</Text>
                    </View>
                    <Text>{item.SumaLibras}</Text>
                  </View>

                  <View style={styles.socialLoginTouchable}>
                    <View style={{flexDirection: 'row'}}>
                      <Icon
                        name="fruit-cherries"
                        type="material-community"
                        color="#F16529"
                      />
                      <Text>Total Muestras</Text>
                    </View>
                    <Text>{item.Muestras}</Text>
                  </View>
                </View>
              </View>
            ))}
          </>
        ) : null}
      </View>

      <View style={styles.button2}>
        <TouchableOpacity
          colors={['#6FA3B9', '#6FA3B9']}
          style={styles.signIn}
          disabled={size(Clien) > 0 || size(GetNotasData) > 0 ? false : true}
          onPress={() => Enviar()}>
          <Icon
            style={styles.icon}
            type="material-community"
            name="server"
            size={25}
            color="white"
          />
          <Text
            style={[
              styles.textSign,
              {
                color: '#fff',
              },
            ]}>
            Enviar
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  conten: {},
  conet: {
    height: 60,
    marginRight: 15,
    marginLeft: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 5,
    marginBottom: 35,
  },
  socialLoginTouchable: {
    backgroundColor: '#fff',
    width: '30%',
    height: 38,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    // borderBottomWidth: 1,
    // borderStyle: 'solid',

    marginLeft: 15,
  },
  conet2: {
    height: 60,
    // borderBottomWidth: 1,
    // borderStyle: 'solid',
    marginRight: 15,
    marginLeft: 15,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 15,
    margin: 5,
    padding: 5,
  },
  button2: {
    borderRadius: 30,
    width: 160,
    marginTop: 10,
    backgroundColor: '#318EFF',
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  signIn: {
    flexDirection: 'row',
    paddingBottom: 5,
    width: '90%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  icon: {
    paddingRight: 5,
  },
});
