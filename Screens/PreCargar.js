import React, {useState, useEffect, useRef, useContext} from 'react';
import {StyleSheet, View, Platform, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {refreshGlobal} from '../Context/Context';
import {
  deleteTable,
  deleteTableMarcas,
  getDBConnection,
  getTablaMarcas,
  getTask,
  initDatabase,
  insertTablaMarcas,
  insertTask,
} from '../Utils/db';
import Usuario from '../Hooks/Usuario';
import {ClienteCafe, MarcasCafe} from '../Utils/Api';
import {size} from 'lodash';

export default function PreCargar({navigation, route}) {
  const {setuserInfo} = route.params;
  const {refreshAPP, Loading, setLoading} = useContext(refreshGlobal);
  console.log('Loading', Loading);
  const {token} = Usuario();

  useEffect(function () {
    async function init() {
      await initDatabase();
    }
    init();
  }, []);

  const ObtenerDatosClientes = async () => {
    try {
      const db = await getDBConnection();
      const taskdatabase = await getTask(db);
      if (size(taskdatabase[0]) > 0) {
        console.log('La tabla clientes tiene datos');
      } else {
        setLoading(true);
        if (size(token) > 0) {
          let url = ClienteCafe();
          let options1 = {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
          };

          fetch(`${url}`, options1)
            .then(res => res.json())
            .then(result => {
              // if (result.status === 1) {
              Eliminar();
              async function init() {
                await initDatabase();
              }
              init();

              result.Clientes.map((item, index) => {
                Agregar(item, index, result);
              });

              // setLoading(false);
              // }
              // if (result.status === 2) {
              //   ToastAndroid.show('Agrege un Comentario!', 3000);
              //   return;
              // }
            })
            .catch(error => {
              console.log('error fetch get Cliente', error);
              setLoading(false);
            });
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const Agregar = async (item, index, result) => {
    try {
      const db = await getDBConnection();
      await insertTask(db, item);
      console.log('se agregaron los datos tabla Cliente');
      db.close;
    } catch (error) {
      console.log(error);
    }

    if (index == result.Clientes.length - 1) {
      setLoading(false);
    }
  };

  const Eliminar = async () => {
    const db = await getDBConnection();
    const query = `DROP TABLE IF EXISTS Clientes`;
    await db.executeSql(query);
  };

  const ObtenerDatosMarcas = async () => {
    const MarcasApi = [];
    try {
      const db = await getDBConnection();
      const taskdatabase = await getTablaMarcas(db);
      if (size(taskdatabase) > 0) {
        console.log('La tabla Marcas tiene datos');
      } else {
        if (size(token) > 0) {
          let url = MarcasCafe();
          let options1 = {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
          };

          fetch(`${url}`, options1)
            .then(res => res.json())
            .then(result => {
              EliminarMarcas();
              async function init() {
                await initDatabase();
              }
              init();
              result.Marcas.forEach(function (item, index) {
                MarcasApi.push({
                  label: item.Nombre,
                  value: item.id,
                });
              });
              MarcasApi.map(item => {
                AgregarMarcas(item);
              });
            })
            .catch(error => {
              console.log('error fetch get Marcas', error);
            });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const AgregarMarcas = async item => {
    try {
      const db = await getDBConnection();
      await insertTablaMarcas(db, item);
      console.log('se agregaron los datos en la tabla marcas');
      db.close;
    } catch (error) {
      console.log(error);
    }
  };

  const EliminarMarcas = async () => {
    const db = await getDBConnection();
    const query = `DROP TABLE IF EXISTS Marcas`;
    await db.executeSql(query);
  };

  //API CLIENTES
  useEffect(() => {
    ObtenerDatosClientes();
    ObtenerDatosMarcas();
  }, [token]);

  const tokenlogin = async () => {
    const value = await AsyncStorage.getItem('token');

    if (value !== null) {
      setuserInfo({
        token: value,
      });
      navigation.navigate('Navigation');
    } else {
      navigation.navigate('Login');
    }
  };

  useEffect(() => {
    tokenlogin();
  }, [refreshAPP]);

  return <></>;
}

const styles = StyleSheet.create({});
