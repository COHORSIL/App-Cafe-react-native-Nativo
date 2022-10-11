import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import {refreshGlobal} from '../../Context/Context';
import {Button, FAB, Portal, Provider} from 'react-native-paper';
import LoadingLogin from '../Loading/LoadingLogin';
import {getDBConnection} from '../../Utils/db';
import LottieWalk from '../Lottie/LottieWalk';
import {size} from 'lodash';

export default function Pantalla1({navigation}) {
  //Buttom grup
  const [state, setState] = React.useState({open: false});
  const [Clien, setClien] = useState([]);
  const onStateChange = ({open}) => setState({open});
  const {open} = state;
  const {Loading, RefreshConsulta, setRefreshConsulta} = useContext(refreshGlobal);

  const Eliminar = async () => {
    const db = await getDBConnection();
    const query = `DROP TABLE IF EXISTS Clientes`;
    await db.executeSql(query);
    console.log('Tabla eliminada cliente');
  };

  useEffect(() => {
    PendientesClientes();
  }, [RefreshConsulta]);

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

  const Eliminar2 = async () => {
    setRefreshConsulta(true)
    const db = await getDBConnection();
    const query = `DROP TABLE IF EXISTS Marcas`;
    await db.executeSql(query);
    console.log('Tabla eliminada marcas');
    setRefreshConsulta(false)
  };

  return (
    <>
      {size(Clien) > 0 ? (
        <LottieWalk Clien={Clien} navigation={navigation} />
      ) : null}
      <LoadingLogin isVisible={Loading} text="Sincronizando Datos" />


      <Button
        onPress={() => {
          Eliminar();
          Eliminar2();
        }}>
        Eliminar Todas las Tabla
      </Button>
      <Provider>
        <Portal>
          <FAB.Group
            open={open}
            icon={open ? 'backburger' : 'plus'}
            actions={[
              {
                icon: 'arrow-right-circle-outline',
                onPress: () => console.log('Pressed add'),
              },
              {
                icon: 'account-plus',
                label: 'Agregar Cliente',
                onPress: () => navigation.navigate('AddCliente'),
              },
              {
                icon: 'sprout-outline',
                label: 'Café Pergamino',
                onPress: () => console.log('Pressed email'),
              },
              {
                icon: 'spa-outline',
                label: 'Café Uva',
                onPress: () => navigation.navigate('BeneficioUva'),
              },
            ]}
            onStateChange={onStateChange}
            onPress={() => {
              if (open) {
                // do something if the speed dial is open
              }
            }}
          />
        </Portal>
      </Provider>
    </>
  );
}

const styles = StyleSheet.create({});
