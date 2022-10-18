import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Modal, Portal, Provider, Button} from 'react-native-paper';
import {
  BluetoothManager,
  BluetoothEscposPrinter,
  BluetoothTscPrinter,
} from 'tp-react-native-bluetooth-printer';
import {size} from 'lodash';
import LottiePrinter from '../Lottie/LottiePrinter';
import {Icon, SearchBar} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ModalImpresora({Impresora, setImpresora}) {
  const [PrintEncontradas, setPrintEncontradas] = useState([]);
  const [Conectada, setConectada] = useState([]);
  const [Estado, setEstado] = useState(false);

  const Scaner = () => {
    ImpresoraLocal();
    BluetoothManager.scanDevices().then(
      scannedDevices => {
        const parsedObj = JSON.parse(scannedDevices);
        // console.log(parsedObj);

        if (size(parsedObj.paired) > 0) {
          setPrintEncontradas(parsedObj.paired);
        } else {
          setPrintEncontradas(parsedObj.found);
        }
      },
      er => {
        console.log(er);
        ToastAndroid.show('Impresora Apagada', 3000);
      },
    );
  };

  useEffect(() => {
    Scaner();
  }, [Impresora]);
  const hideModal = () => setImpresora(false);
  const Printselect = async item => {
    BluetoothManager.connect(item.address) // the device address scanned.
      .then(
        s => {
          console.log('s', s);
          AsyncStorage.setItem('print', JSON.stringify(item));
          setConectada(item);
          setEstado(true);
        },
        e => {
          console.log('e', e);
          setEstado(false);
          setConectada([]);
        },
      );
  };

  const ImpresoraLocal = async () => {
    const value = await AsyncStorage.getItem('print');
    let print = JSON.parse(value);
    if (value !== null) {
      setConectada(print);
      BluetoothManager.connect(print.address) // the device address scanned.
        .then(
          s => {
            console.log('Conectada');
            setEstado(true);
          },
          e => {
            console.log('Desconectada');
            // ToastAndroid.show('Impresora Apagada', 3000);
            setEstado(false);
          },
        );
      return;
    }
  };

  return (
    <>
      <Portal>
        <Modal visible={Impresora} onDismiss={hideModal}>
          <View style={{backgroundColor: 'white'}}>
            {size(PrintEncontradas) <= 0 ? (
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <LottiePrinter />
                <Text>Buscando Impresoras...</Text>
              </View>
            ) : (
              <View>
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: 18,
                  }}>
                  Impresoras Encontradas
                </Text>

                <ScrollView style={{height: '50%'}}>
                  {PrintEncontradas.map((item, index) => (
                    <TouchableOpacity
                      onPress={() => Printselect(item)}
                      key={index}
                      style={{
                        height: 30,
                        borderBottomWidth: 0.5,
                        borderStyle: 'solid',
                        flexDirection: 'row',
                        margin: 5,
                      }}>
                      <Icon
                        type="material-community"
                        name="printer"
                        size={22}
                        color="#00a680"
                        style={{marginRight: 5}}
                      />
                      <Text style={{textAlign: 'left'}}>
                        Dispocitivo: {item.name} / {item.address}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <TouchableOpacity onPress={() => ImpresoraLocal()}>
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 18,
                }}>
                Impresora Vinculada
              </Text>

              <View>
                <Text style={{textAlign: 'center'}}>{Conectada.name}</Text>
                {Estado ? (
                  <Text
                    style={{
                      textAlign: 'center',
                      color: 'green',
                      fontWeight: 'bold',
                    }}>
                    Conectada
                  </Text>
                ) : (
                  <Text
                    style={{
                      textAlign: 'center',
                      color: 'red',
                      fontWeight: 'bold',
                    }}>
                    Desconectada
                  </Text>
                )}
              </View>
            </TouchableOpacity>

            <View
              style={{
                width: 200,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 20,
              }}>
              <Button
                icon="close"
                mode="contained"
                color="red"
                onPress={() => hideModal()}>
                Cerrar
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({});
