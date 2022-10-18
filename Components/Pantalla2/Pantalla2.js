import {
  StyleSheet,
  Text,
  View,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import {getDBConnection} from '../../Utils/db';

import Grafica1 from './Grafico1/Grafica1';
import {size, map} from 'lodash';
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
import DatePicker, {getFormatedDate} from 'react-native-modern-datepicker';
import LoadingLogin from '../Loading/LoadingLogin';
import Grafico2 from './Grafico2/Grafico2';
import LottieGraficos from '../Lottie/LottieGraficos';
import {Icon, SearchBar} from 'react-native-elements';
import moment from 'moment/moment';
import {ScrollView} from 'react-native-gesture-handler';
moment.locale('es');

export default function Pantalla2() {
  const [Load, setLoad] = useState('Cargando');
  const [Labels, setLabels] = useState([]);
  const {RefreshConsulta} = useContext(refreshGlobal);
  const [Fechasearh, setFechasearh] = useState(moment().format('DD/MM/YYYY'));
  const [isVisible, setisVisible] = useState(false);
  const [TotalSacos, setTotalSacos] = useState(0);
  const [TotalLibras, setTotalLibras] = useState(0);
  const [TotalMuestras, setTotalMuestras] = useState(0);

  const [NombreCli, setNombreCli] = useState([]);
  const [LibraT, setLibraT] = useState([]);

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

      let Array = [];
      let Array2 = [];
      let Nombre = [];
      let Libras = [];
      if (size(task) > 0) {
        task.forEach(function (item, index) {
          Array.push({
            cliente: JSON.parse(item.Cliente),
            SumaSacos: item.SumaSacos,
            Id: item.id,
            SumaLibras: item.SumaLibras,
            Muestras: item.Muestras,
          });
        });

        Array.forEach(function (item, index) {
          var x = Math.round(0xffffff * Math.random()).toString(16);
          var y = 6 - x.length;
          var z = '000000';
          var z1 = z.substring(0, y);
          var color = '#' + z1 + x;

          Array2.push({
            name: item.cliente.Nombre,
            population: Number(item.SumaSacos),
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
            color: color,
            key: item.Id,
            label: item.cliente.Nombre,
          });
        });


        Array.forEach(function (item, index) {
          Nombre.push(item.cliente.Nombre.substring(0, 6)),
            Libras.push(Number(item.SumaLibras));
        });

        setNombreCli(Nombre);
        setLibraT(Libras);

        setLabels(Array2);
        Calculos(Array);
      }
      setLoad('No hay Notas');
    } catch (error) {
      console.error(error);
      setLoad('No hay Notas');
      throw Error('Error al obtener los datos !!!');
    }
  };

  const Fecht = async item => {
    let fecha = moment(item).format('DD/MM/YYYY');
    let Array = [];
    let Array2 = [];
    let Nombre = [];
    let Libras = [];

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

      if (size(task) > 0) {
        setFechasearh(fecha);
        task.forEach(function (item, index) {
          Array.push({
            cliente: JSON.parse(item.Cliente),
            SumaSacos: item.SumaSacos,
            Id: item.id,
            SumaLibras: item.SumaLibras,
            Muestras: item.Muestras,
          });
        });

        Array.forEach(function (item, index) {
          var x = Math.round(0xffffff * Math.random()).toString(16);
          var y = 6 - x.length;
          var z = '000000';
          var z1 = z.substring(0, y);
          var color = '#' + z1 + x;

          Array2.push({
            name: item.cliente.Nombre,
            population: Number(item.SumaSacos),
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
            color: color,
            key: item.Id,
            label: item.cliente.Nombre,
          });
        });

        Array.forEach(function (item, index) {
          Nombre.push(item.cliente.Nombre.substring(0, 6)),
            Libras.push(Number(item.SumaLibras));
        });

        setNombreCli(Nombre);
        setLibraT(Libras);
        setLabels(Array2);
        setVisible(false);
        setisVisible(false);
        Calculos(Array);
      } else {
        setLoad('No hay Datos');
        setisVisible(false);
        ToastAndroid.show('No hay Datos en este Dia!', 3000);
      }
    } catch (error) {
      // console.error('Error al obtener los datos !!!');
      ToastAndroid.show('No hay Datos en este Dia error!', 3000);
      setisVisible(false);
    }
  };

  useEffect(() => {
    PendientesNotas();
  }, [RefreshConsulta]);

  const [visible, setVisible] = useState(false);

  const hideDialog = () => setVisible(false);

  const Calculos = Array => {
    console.log(Array);

    let calcularsuma = 0;
    let calcularsumaLibras = 0;
    let muestras = 0;

    map(Array, item => {
      (calcularsuma = calcularsuma + Number(item.SumaSacos)),
        (calcularsumaLibras = calcularsumaLibras + Number(item.SumaLibras)),
        (muestras = muestras + Number(item.Muestras));
    });

    setTotalSacos(calcularsuma);
    setTotalLibras(calcularsumaLibras);
    setTotalMuestras(muestras);
  };

  return (
    <>
      <LoadingLogin isVisible={isVisible} text="Buscando Datos" />

      <View
        style={{
          flexDirection: 'row',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            color: 'black',
            fontSize: 20,
          }}>
          Estadisticas del Dia {Fechasearh}
        </Text>
        <IconButton
          icon="calendar"
          size={35}
          onPress={() => setVisible(true)}
        />
      </View>
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

      {size(Labels) > 0 ? (
        <ScrollView>
          <Grafica1 Labels={Labels} />

          <Grafico2 NombreCli={NombreCli} LibraT={LibraT} />

          <View
            style={{
              backgroundColor: '#CB5D50',
              width: 250,
              height: 40,
              borderTopRightRadius: 15,
              borderBottomRightRadius: 15,
              marginTop: 35,
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 18,
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              Totales
            </Text>
          </View>
          <View
            style={[
              styles.socialLoginView,
              {marginTop: 14, justifyContent: 'flex-start'},
            ]}>
            <TouchableOpacity
              style={[styles.socialLoginTouchable, {marginLeft: 0}]}>
              <Icon name="sack" type="material-community" color="#F16529" />
              <Text>Total Sacos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialLoginTouchable}>
              <Icon
                name="weight-pound"
                type="material-community"
                color="#F16529"
              />
              <Text>Total Libras</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialLoginTouchable}>
              <Icon
                name="fruit-cherries"
                type="material-community"
                color="#F16529"
              />
              <Text>Total Muestras</Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.socialLoginView,
              {marginTop: 14, justifyContent: 'flex-start'},
            ]}>
            <View style={{width: '33%'}}>
              <View style={{marginLeft: 'auto', marginRight: 'auto'}}>
                <View style={styles.socialLoginTouchable2}>
                  <Text style={{fontSize: 21}}>{TotalSacos}</Text>
                </View>
              </View>
            </View>

            <View style={{width: '33%'}}>
              <View style={{marginLeft: 'auto', marginRight: 'auto'}}>
                <View style={styles.socialLoginTouchable2}>
                  <Text style={{fontSize: 21}}>{TotalLibras}</Text>
                </View>
              </View>
            </View>

            <View style={{width: '33%'}}>
              <View style={{marginLeft: 'auto', marginRight: 'auto'}}>
                <View style={styles.socialLoginTouchable2}>
                  <Text style={{fontSize: 21}}>{TotalMuestras}</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View>
          <LottieGraficos />
          <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>
            {Load}
          </Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  socialLoginView: {
    marginTop: 40,
    marginHorizontal: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialLoginTouchable: {
    backgroundColor: '#fff',
    width: '33%',
    height: 40,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    // marginHorizontal: 8,
    margin: 5,
    flexDirection: 'row',
  },
  socialLoginTouchable2: {
    backgroundColor: '#fff',
    width: 80,
    height: 80,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    // margin: 5,
  },
});
