import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import {refreshGlobal} from '../../Context/Context';
import {
  Button,
  FAB,
  Portal,
  Provider,
  Card,
  Paragraph,
  Dialog,
  IconButton,
} from 'react-native-paper';
import LoadingLogin from '../Loading/LoadingLogin';
import {getDBConnection} from '../../Utils/db';
import LottieWalk from '../Lottie/LottieWalk';
import {size} from 'lodash';
import {BluetoothManager} from 'tp-react-native-bluetooth-printer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieLoadinNotas from '../Lottie/LottieLoadinNotas';
import DatePicker, {getFormatedDate} from 'react-native-modern-datepicker';
import {Icon} from 'react-native-elements';
import moment from 'moment/moment';
moment.locale('es');

export default function Pantalla1({navigation}) {
  //Buttom grup
  const [state, setState] = React.useState({open: false});
  const [Clien, setClien] = useState([]);
  const [Notas, setNotas] = useState([]);
  const [Notalenth, setNotalenth] = useState([]);
  const [PedienteTotal, setPedienteTotal] = useState(0);
  const [GetNotasData, setGetNotasData] = useState([]);
  const [Load, setLoad] = useState('Cargando');
  const onStateChange = ({open}) => setState({open});
  const [Fechasearh, setFechasearh] = useState(moment().format('DD/MM/YYYY'));
  const [isVisible, setisVisible] = useState(false);
  const {open} = state;
  const {Loading, RefreshConsulta, setRefreshConsulta} =
    useContext(refreshGlobal);



  const Eliminar = async () => {
    const db = await getDBConnection();
    const query = `DROP TABLE IF EXISTS Clientes`;
    await db.executeSql(query);
    console.log('Tabla eliminada cliente');
  };

  const Eliminar3 = async () => {
    const db = await getDBConnection();
    const query = `DROP TABLE IF EXISTS Notas`;
    await db.executeSql(query);
    console.log('Tabla eliminada cliente');
  };

  useEffect(() => {
    PendientesClientes();
    PendientesNotasLenth();
    PendientesNotas();
    ImpresoraLocal();
  }, [RefreshConsulta]);

  useEffect(() => {
    let suma = Notalenth.length + Clien.length;

    setPedienteTotal(suma);
  }, [Clien, Notalenth, RefreshConsulta]);

  const PendientesClientes = async () => {
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
  const PendientesNotasLenth = async () => {
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
      setNotalenth(task);
    } catch (error) {
      console.error(error);
      throw Error('Error al obtener los datos !!!');
    }
  };

  const PendientesNotas = async () => {
    let fecha = moment().format('DD/MM/YYYY');
    const db = await getDBConnection();
    try {
      const task = [];
      const results = await db.executeSql(
        `SELECT * FROM Notas WHERE FechaCreacion LIKE '%${fecha}%'`,
      );

      setLoad('Cargando Espere...');

      results.forEach(result => {
        for (let index = 0; index < result.rows.length; index++) {
          task.push(result.rows.item(index));
        }
      });

      setNotas(task);
      console.log(task);
  

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
      setLoad('No hay Notas');
    } catch (error) {
      console.error(error);
      setLoad('No hay Notas');
      throw Error('Error al obtener los datos !!!');
    }
  };

  const Eliminar2 = async () => {
    setRefreshConsulta(true);
    const db = await getDBConnection();
    const query = `DROP TABLE IF EXISTS Marcas`;
    await db.executeSql(query);
    console.log('Tabla eliminada marcas');
    setRefreshConsulta(false);
  };

  const ImpresoraLocal = async () => {
    const value = await AsyncStorage.getItem('print');
    let print = JSON.parse(value);
    if (value !== null) {
      BluetoothManager.connect(print.address);
      return;
    }
  };

  const GoPedidos = item => {
    if (item === 1) {
      navigation.navigate('BeneficioUva', {
        data: 'Pergamino',
      });
    } else {
      navigation.navigate('BeneficioUva', {
        data: 'Uva',
      });
    }
  };

  const [visible, setVisible] = useState(false);

  const hideDialog = () => setVisible(false);

  const Fecht = async item => {
    let fecha = moment(item).format('DD/MM/YYYY');

    const db = await getDBConnection();
    try {
      setisVisible(true);
      const task = [];
      const results = await db.executeSql(
        `SELECT * FROM Notas WHERE FechaCreacion LIKE '%${fecha}%'`,
      );
      results.forEach(result => {
        for (let index = 0; index < result.rows.length; index++) {
          task.push(result.rows.item(index));
        }
      });

      setNotas(task);
      let Array = [];
      if (size(task) > 0) {
        setFechasearh(fecha);
        setVisible(false);
        setisVisible(false);
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
      } else {
        setLoad('No hay Notas');
        setisVisible(false);
        ToastAndroid.show('No hay Notas en este Dia!', 3000);
      }

      console.log('Calendario Busquedad', task);
    } catch (error) {
      console.error('Error al obtener los datos !!!');
      setisVisible(false);
    }
  };

  return (
    <>
      <LoadingLogin isVisible={isVisible} text="Buscando Notas" />
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Content>
            <DatePicker
              selected={moment().format('YYYY/MM/DD')}
              // onSelectedChange={date => Fecht(date)}
              onDateChange={date => Fecht(date)}
            />
            <Button
              icon="close"
              color="#3F8C4D"
              mode="contained"
              onPress={() => hideDialog()}>
              Cerrar
            </Button>
          </Dialog.Content>
        </Dialog>
      </Portal>

      {Number(PedienteTotal) > 0 ? (
        <LottieWalk Clien={PedienteTotal} navigation={navigation} />
      ) : null}
      <LoadingLogin isVisible={Loading} text="Sincronizando Datos" />

      <View
        style={{flexDirection: 'row', marginLeft: 'auto', marginRight: 'auto'}}>
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            color: 'black',
            fontSize: 20,
          }}>
          Notas del Dia {Fechasearh}
        </Text>
        <IconButton
          icon="calendar"
          size={35}
          onPress={() => setVisible(true)}
        />
      </View>

      <ScrollView>
        {size(GetNotasData) > 0 ? (
          <>
            {GetNotasData.map((item, index) => (
              <TouchableOpacity
                style={{marginBottom: 25}}
                onPress={() =>
                  navigation.navigate('VerNotas', {
                    Nota: item,
                  })
                }>
                <Card style={{height: 120}} key={index}>
                  <Card.Content>
                    <View style={{flexDirection: 'row'}}>
                      <Icon
                        type="material-community"
                        name="account"
                        size={25}
                        color="#BD5F4B"
                      />
                      <Paragraph style={{fontWeight: 'bold'}}>
                        Nombre: {item.cliente.Nombre}
                      </Paragraph>
                    </View>

                    <View style={{flexDirection: 'row'}}>
                      <Icon
                        type="material-community"
                        name="counter"
                        size={25}
                        color="#BD5F4B"
                      />
                      <Paragraph style={{fontWeight: 'bold'}}>
                        Identidad: {item.cliente.Identidad}
                      </Paragraph>
                    </View>

                    <Text style={styles.id}> Altura: {item.Altura}</Text>

                    <View>
                      <Text
                        style={{
                          fontFamily: 'Inter_900Black',
                          fontSize: 15,
                        }}>
                        Marca: {item.Marca}
                      </Text>
                    </View>

                    <View
                      style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',

                        marginTop: -10,
                        backgroundColor: 'white',
                        width: 200,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderStyle: "solid",
                        borderColor: "#ABABAB"
                      }}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          color: '#256A86',
                          fontSize: 20,
                          textAlign: 'center',
                        }}>
                        Cafe {item.Tipo}
                      </Text>
                    </View>

                    <View
                      style={{
                        position: 'absolute',
                        right: 10,
                      }}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          color: '#256A86',
                          fontSize: 18,
                          textAlign: 'center',
                        }}>
                        {item.Fecha}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        position: 'absolute',
                        bottom: 38,
                        right: 0,
                      }}>
                      <Text
                        style={{
                          marginRight: 15,
                          fontWeight: 'bold',
                          color: '#D97D7D',
                        }}>
                        Muestras: {item.Muestras}
                      </Text>

                      <Text
                        style={{
                          marginRight: 15,
                          fontWeight: 'bold',
                          color: '#D97D7D',
                        }}>
                        Sacos: {item.SumaSacos}
                      </Text>
                    </View>

                    <View style={{position: 'absolute', bottom: 60, right: 15}}>
                      <Icon
                        type="material-community"
                        name="chevron-right"
                        size={40}
                        color="#BD5F4B"
                      />
                    </View>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <View
            style={{
              display: 'flex',
              alignContent: 'center',
              alignItems: 'center',
            }}>
            <View style={{marginTop: '30%'}}>
              <LottieLoadinNotas />
            </View>
            <Text>{Load}</Text>
          </View>
        )}
      </ScrollView>

      <Button
        onPress={() => {
          Eliminar2();
          Eliminar3();
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
                onPress: () => GoPedidos(1),
              },
              {
                icon: 'spa-outline',
                label: 'Café Uva',
                onPress: () => GoPedidos(2),
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
