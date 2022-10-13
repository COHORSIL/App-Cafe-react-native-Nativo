import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import LottieSend from '../../Lottie/LottieSend';
import {getDBConnection} from '../../../Utils/db';
import {refreshGlobal} from '../../../Context/Context';
import {IconButton} from 'react-native-paper';
import {size} from 'lodash';

export default function Pendientes() {
  const {RefreshConsulta, setRefreshConsulta} = useContext(refreshGlobal);
  const [Clien, setClien] = useState([]);
  const [GetNotasData, setGetNotasData] = useState([]);
  console.log(GetNotasData);

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
        `SELECT * FROM Notas WHERE Estado LIKE '%1%'`,
      );

      results.forEach(result => {
        for (let index = 0; index < result.rows.length; index++) {
          task.push(result.rows.item(index));
        }
      });

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
    PendientesNotas()
  }, [RefreshConsulta]);

  const deleCliente = async item => {
    setRefreshConsulta(true);
    const db = await getDBConnection();
    const deleteQuery = `DELETE from Clientes where rowid = ${item.id}`;
    await db.executeSql(deleteQuery);
    setRefreshConsulta(false);
  };

  return (
    <>
      <View style={{maxHeight: '40%'}}>
        <ScrollView>
          <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
            Clientes Creados
          </Text>
          {size(Clien) > 0 ? (
            <>
              {Clien.map((item, index) => (
                <View key={index} style={styles.conet}>
                  <View style={{width: '80%'}}>
                    <Text style={{textAlign: 'left', fontWeight: 'bold'}}>
                      Cliente: {item.Nombre}
                    </Text>
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
        <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
          Notas Creadas
        </Text>
        {size(Clien) > 0 ? (
          <>
            {GetNotasData.map((item, index) => (
              <View key={index} style={styles.conet}>
                <View style={{width: '80%'}}>
                  <Text style={{textAlign: 'left', fontWeight: 'bold'}}>
                  Nombre: {item.cliente.Nombre}
                  </Text>
                  <Text style={{textAlign: 'left', fontWeight: 'bold'}}>
                    Identidad: {item.cliente.Identidad}
                  </Text>
                </View>

       
              </View>
            ))}
          </>
        ) : null}
      </View>

      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={styles.conten}
          // onPress={() => navigation.navigate("Pendientes")}
        >
          <LottieSend />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  conten: {},
  conet: {
    height: 60,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    marginRight: 15,
    marginLeft: 15,
    flexDirection: 'row',
  },
});
