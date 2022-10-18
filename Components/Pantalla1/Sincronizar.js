import {StyleSheet, Text, View, ToastAndroid} from 'react-native';
import React, {useEffect, useContext} from 'react';
import {refreshGlobal} from '../../Context/Context';
import {getDBConnection} from '../../Utils/db';
import Usuario from '../../Hooks/Usuario';
import {Notas, ClienteNotas} from '../../Utils/Api';
import {size} from 'lodash';

export default function Sincronizar({Fechasearh}) {
  const {token} = Usuario();
  const {Sincron, setSincronizar} = useContext(refreshGlobal);

  const PostSinconizar = () => {
    ClientesCreados();
    NotasCreadas();
    setSincronizar(false);
  };

  const ClientesCreados = async () => {
    const db = await getDBConnection();
    try {
      const task = [];
      const results = await db.executeSql(
        `SELECT * FROM Clientes WHERE FechaCreacion LIKE '%${Fechasearh}%'`,
      );
      results.forEach(result => {
        for (let index = 0; index < result.rows.length; index++) {
          task.push(result.rows.item(index));
        }
      });

      if (size(task) > 0) {
        {
          task.map((item, index) => {
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
                  ToastAndroid.show(`${responseJson.descripcion}`, 3000);
                  return;
                }

                if (responseJson.status === 2) {
                  ToastAndroid.show(`${responseJson.descripcion}`, 3000);
                  return;
                }
              })
              .catch(error => {
                console.error(error);
              });
          });
        }
      }
    } catch (error) {
      console.log('error tabla cliente');
    }
  };
  const NotasCreadas = async () => {
    const db = await getDBConnection();
    try {
      const task = [];
      const results = await db.executeSql(
        `SELECT * FROM Notas WHERE FechaCreacion LIKE '%${Fechasearh}%'`,
      );

      results.forEach(result => {
        for (let index = 0; index < result.rows.length; index++) {
          task.push(result.rows.item(index));
        }
      });

      if (size(task) > 0) {
        {
          task.map(item => {
            const requestOptions = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: token,
              },
              body: JSON.stringify({
                item,
              }),
            };
            var url = Notas();
            fetch(url, requestOptions)
              .then(response => response.json())
              .then(responseJson => {
                if (responseJson.status === 1) {
                  ToastAndroid.show(`${responseJson.descripcion}`, 3000);
                  return;
                }

                if (responseJson.status === 2) {
                  ToastAndroid.show(`${responseJson.descripcion}`, 3000);
                  return;
                }
              })
              .catch(error => {
                console.error(error);
              });
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (Sincron) {
      PostSinconizar();
      return;
    }
  }, [Sincron]);

  return <></>;
}

const styles = StyleSheet.create({});
