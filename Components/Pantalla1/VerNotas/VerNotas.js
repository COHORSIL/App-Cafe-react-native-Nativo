import {StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import ModalImpresora from '../../ModalImpresora/ModalImpresora';
import {
  Button,
  TextInput,
  Card,
  IconButton,
  Paragraph,
  Dialog,
  Portal,
  Provider,
  Modal,
} from 'react-native-paper';
import {size} from 'lodash';
import {
  BluetoothManager,
  BluetoothEscposPrinter,
  BluetoothTscPrinter,
} from 'tp-react-native-bluetooth-printer';
import moment from 'moment';

export default function VerNotas(props) {
  const {navigation} = props;
  const {params} = props.route;
  const {
    Altura,
    cliente,
    Marca,
    Beneficio,
    Estado,
    SumaLibras,
    SumaSacos,
    Muestras,
    Tipo,
    EstadoCafe,
    Observacion,
    Fecha,
    PrecioFijado,
    Pesos,
  } = params.Nota;

  const [Impresora, setImpresora] = useState(false);
  const printText = async () => {
    await BluetoothEscposPrinter.printerAlign(
      BluetoothEscposPrinter.ALIGN.CENTER,
    );

    await BluetoothEscposPrinter.setBlob(0);
    await BluetoothEscposPrinter.printText(
      '--------------------------------\n\r',
      {},
    );
    await BluetoothEscposPrinter.printText('COHORSIL\n\r', {
      encoding: 'GBK',
      codepage: 0,
      widthtimes: 1,
      heigthtimes: 1,
      fonttype: 1,
    });

    await BluetoothEscposPrinter.setBlob(1);
    await BluetoothEscposPrinter.printText('Siguatepeque, Honduras\n\r', {
      encoding: 'GBK',
      codepage: 0,
      widthtimes: 0,
      heigthtimes: 0,
    });

    await BluetoothEscposPrinter.printText('Tel: 2773-0872 y 2773-2794\n\r', {
      encoding: 'GBK',
      codepage: 0,
      widthtimes: 0,
      heigthtimes: 0,
    });

    await BluetoothEscposPrinter.printText('Nota de peso: F-RP-GC-72\n\r', {
      encoding: 'GBK',
      codepage: 0,
      widthtimes: 0,
      heigthtimes: 0,
    });

    await BluetoothEscposPrinter.printText(
      '--------------------------------\n\r',
      {},
    );

    await BluetoothEscposPrinter.printerAlign(
      BluetoothEscposPrinter.ALIGN.LEFT,
    );
    await BluetoothEscposPrinter.setBlob(1);
    await BluetoothEscposPrinter.printText('Nota de peso NO: CI-3\n\r', {
      encoding: 'GBK',
      codepage: 0,
      widthtimes: 0,
      heigthtimes: 0,
    });

    await BluetoothEscposPrinter.printText(`Fecha: ${Fecha}\n\r`, {
      encoding: 'GBK',
      codepage: 0,
      widthtimes: 0,
      heigthtimes: 0,
    });

    await BluetoothEscposPrinter.printText(
      `ID Productor: ${cliente.Identidad}\n\r`,
      {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
      },
    );

    await BluetoothEscposPrinter.printText(
      `Nombre Productor: ${cliente.Nombre}\n\r`,
      {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
      },
    );

    await BluetoothEscposPrinter.printText(`Beneficio: CICAM\n\r`, {
      encoding: 'GBK',
      codepage: 0,
      widthtimes: 0,
      heigthtimes: 0,
    });

    await BluetoothEscposPrinter.printText(`Marca: ${Marca}\n\r`, {
      encoding: 'GBK',
      codepage: 0,
      widthtimes: 0,
      heigthtimes: 0,
    });

    await BluetoothEscposPrinter.printText(
      `Altura: ${Altura}    Estado: ${Tipo}\n\r`,
      {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
      },
    );

    await BluetoothEscposPrinter.printText(
      `Humedad: ${EstadoCafe.Humedad ? EstadoCafe.Humedad : 0} \n\r`,
      {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
      },
    );

    await BluetoothEscposPrinter.printText(`Peso en: Libras\n\r`, {
      encoding: 'GBK',
      codepage: 0,
      widthtimes: 0,
      heigthtimes: 0,
    });

    await BluetoothEscposPrinter.printText(
      '------------Descuentos----------\n\r',
      {},
    );

    if (Tipo === 'Uva') {
      await BluetoothEscposPrinter.printText(
        `Fruto Verde: ${
          EstadoCafe.Frutoverde ? EstadoCafe.Frutoverde : 0
        }  Fruto Seco: ${EstadoCafe.Frutoseco ? EstadoCafe.Frutoseco : 0}\n\r`,
        {
          encoding: 'GBK',
          codepage: 0,
          widthtimes: 0,
          heigthtimes: 0,
        },
      );

      await BluetoothEscposPrinter.printText(
        `Fruto Brocado: ${
          EstadoCafe.FrutoBrocado ? EstadoCafe.FrutoBrocado : 0
        }  Materia: ${EstadoCafe.Materia ? EstadoCafe.Materia : 0}\n\r`,
        {
          encoding: 'GBK',
          codepage: 0,
          widthtimes: 0,
          heigthtimes: 0,
        },
      );
    } else {
      await BluetoothEscposPrinter.printText(
        `Cereza: ${EstadoCafe.Cereza ? EstadoCafe.Cereza : 0}  Inmaduro: ${
          EstadoCafe.Inmaduro ? EstadoCafe.Inmaduro : 0
        }\n\r`,
        {
          encoding: 'GBK',
          codepage: 0,
          widthtimes: 0,
          heigthtimes: 0,
        },
      );

      await BluetoothEscposPrinter.printText(
        `Manchado: ${EstadoCafe.Manchado ? EstadoCafe.Manchado : 0}  Mordido: ${
          EstadoCafe.Mordido ? EstadoCafe.Mordido : 0
        }\n\r`,
        {
          encoding: 'GBK',
          codepage: 0,
          widthtimes: 0,
          heigthtimes: 0,
        },
      );

      await BluetoothEscposPrinter.printText(
        `Negro: ${EstadoCafe.Negro ? EstadoCafe.Negro : 0}  Pelado: ${
          EstadoCafe.Pelado ? EstadoCafe.Pelado : 0
        }\n\r`,
        {
          encoding: 'GBK',
          codepage: 0,
          widthtimes: 0,
          heigthtimes: 0,
        },
      );

      await BluetoothEscposPrinter.printText(
        `Pulpa: ${EstadoCafe.Pulpa ? EstadoCafe.Pulpa : 0}\n\r`,
        {
          encoding: 'GBK',
          codepage: 0,
          widthtimes: 0,
          heigthtimes: 0,
        },
      );
    }

    await BluetoothEscposPrinter.printText(
      '--------------------------------\n\r',
      {},
    );

    await BluetoothEscposPrinter.printText(
      `Precio Fijado: ${PrecioFijado}\n\r`,
      {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
      },
    );

    await BluetoothEscposPrinter.printText(
      `Muestras Tomadas: ${Muestras}\n\r`,
      {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
      },
    );

    await BluetoothEscposPrinter.printText(`Observacion: ${Observacion}\n\r`, {
      encoding: 'GBK',
      codepage: 0,
      widthtimes: 0,
      heigthtimes: 0,
    });

    await BluetoothEscposPrinter.printText(
      '--------------------------------\n\r',
      {},
    );

    await BluetoothEscposPrinter.printText('     #Sacos:    |    Libras\n\r', {
      encoding: 'GBK',
      codepage: 0,
      widthtimes: 0,
      heigthtimes: 0,
    });

    await BluetoothEscposPrinter.printText(
      '--------------------------------\n\r',
      {},
    );

    {
      JSON.parse(Pesos).map(
        async item =>
          await BluetoothEscposPrinter.printText(
            `\t${item.Sacos.padEnd(5, ' ')}   |    ${item.Libras.padEnd(
              5,
              ' ',
            )}\n\r`,
            {
              encoding: 'GBK',
              codepage: 0,
              widthtimes: 0,
              heigthtimes: 0,
            },
          ),
      );
    }

    await BluetoothEscposPrinter.printText(
      '--------------------------------\n\r',
      {},
    );

    await BluetoothEscposPrinter.printText(
      `Total de Libras: ${SumaLibras}\n\r`,
      {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
      },
    );

    await BluetoothEscposPrinter.printText(`Total de Sacos: ${SumaSacos}\n\r`, {
      encoding: 'GBK',
      codepage: 0,
      widthtimes: 0,
      heigthtimes: 0,
    });

    await BluetoothEscposPrinter.printText(
      `\n\rHora: ${moment().format('LT')}\n\r`,
      {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
      },
    );
    await BluetoothEscposPrinter.printText(
      `Fecha de Impresion: ${moment().format('L')}\n\r`,
      {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
      },
    );

    await BluetoothEscposPrinter.printText(
      '\n\r\n\r\n\r--------------------------------\n\r',
      {},
    );

    await BluetoothEscposPrinter.printerAlign(
      BluetoothEscposPrinter.ALIGN.CENTER,
    );
    await BluetoothEscposPrinter.printText(`Firma del Cliente\n\r`, {
      encoding: 'GBK',
      codepage: 0,
      widthtimes: 0,
      heigthtimes: 0,
    });

    await BluetoothEscposPrinter.printText(
      '\n\r--------------------------------\n\r',
      {},
    );
    await BluetoothEscposPrinter.printerAlign(
      BluetoothEscposPrinter.ALIGN.LEFT,
    );
    await BluetoothEscposPrinter.printText(
      `La Nota de Peso Tendra una vigencia de 2 Meses en Deposito:\n\r`,
      {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
      },
    );

    await BluetoothEscposPrinter.printText(
      '\n\r--------------------------------\n\r',
      {},
    );

    await BluetoothEscposPrinter.printText(
      '\n\r\n\r\n\r-----Comprobante Beneficio-----\n\r',
      {},
    );
    await BluetoothEscposPrinter.printText(
      '\n\r-------Fin de Linea-------\n\r',
      {},
    );
  };

  return (
    <>
      <ModalImpresora Impresora={Impresora} setImpresora={setImpresora} />

      <View>
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            color: 'black',
            fontSize: 25,
            margin: 10,
          }}>
          Cafe {Tipo}
        </Text>

        <View
          style={{
            marginRight: '5%',
            marginLeft: '5%',
            borderWidth: 1,
            borderStyle: 'solid',
            borderRadius: 15,
            padding: 5,
          }}>
          <Text style={{fontWeight: 'bold', color: 'black'}}>
            Cliente: {cliente.Nombre}
          </Text>
          <Text style={{fontWeight: 'bold', color: 'black'}}>
            Identidad: {cliente.Identidad}
          </Text>
          <Text style={{fontWeight: 'bold', color: 'black'}}>
            Marca: {Marca}
          </Text>
          <Text
            style={{color: '#C26262', fontWeight: 'bold', textAlign: 'center'}}>
            Estado:{' '}
            {Number(Estado) === 1 ? 'Pendiente de Enviar' : 'Sicronizada'}
          </Text>
        </View>

        <Text
          style={{
            textAlign: 'left',
            fontWeight: 'bold',
            color: 'black',
            fontSize: 20,
            marginLeft: 15,
          }}>
          Pesos
        </Text>
        <View style={{flexDirection: 'row', margin: 15}}>
          <View style={{width: '33%'}}>
            <Text
              style={{textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>
              Total Sacos: {SumaSacos}
            </Text>
          </View>

          <View style={{width: '33%'}}>
            <Text
              style={{textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>
              Total Libras: {SumaLibras}
            </Text>
          </View>

          <View style={{width: '33%'}}>
            <Text
              style={{textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>
              Muestra(s): {Muestras}
            </Text>
          </View>
        </View>

        <Text
          style={{
            textAlign: 'left',
            fontWeight: 'bold',
            color: 'black',
            fontSize: 20,
            marginLeft: 15,
          }}>
          Descuentos
        </Text>

        {size(EstadoCafe) > 0 ? (
          <View style={{marginLeft: 15}}>
            {EstadoCafe.Humedad ? (
              <Text>Humedad: {EstadoCafe.Humedad}</Text>
            ) : null}

            {EstadoCafe.Frutoverde ? (
              <Text style={{fontWeight: 'bold', color: '#31618C'}}>
                Fruto verde: {EstadoCafe.Frutoverde}
              </Text>
            ) : null}

            {EstadoCafe.FrutoBrocado ? (
              <Text style={{fontWeight: 'bold', color: '#31618C'}}>
                Fruto Brocado: {EstadoCafe.FrutoBrocado}
              </Text>
            ) : null}

            {EstadoCafe.Frutoseco ? (
              <Text style={{fontWeight: 'bold', color: '#31618C'}}>
                Fruto seco: {EstadoCafe.Frutoseco}
              </Text>
            ) : null}

            {EstadoCafe.Humedad ? (
              <Text style={{fontWeight: 'bold', color: '#31618C'}}>
                Humedad: {EstadoCafe.Humedad}
              </Text>
            ) : null}
            {EstadoCafe.Mordido ? (
              <Text style={{fontWeight: 'bold', color: '#31618C'}}>
                Mordido: {EstadoCafe.Mordido}
              </Text>
            ) : null}
            {EstadoCafe.Negro ? (
              <Text style={{fontWeight: 'bold', color: '#31618C'}}>
                Negro: {EstadoCafe.Negro}
              </Text>
            ) : null}
            {EstadoCafe.Pulpa ? (
              <Text style={{fontWeight: 'bold', color: '#31618C'}}>
                Pulpa: {EstadoCafe.Pulpa}
              </Text>
            ) : null}
            {EstadoCafe.Pelado ? (
              <Text style={{fontWeight: 'bold', color: '#31618C'}}>
                Pelado: {EstadoCafe.Pelado}
              </Text>
            ) : null}
            {EstadoCafe.Inmaduro ? (
              <Text style={{fontWeight: 'bold', color: '#31618C'}}>
                Inmaduro: {EstadoCafe.Inmaduro}
              </Text>
            ) : null}
            {EstadoCafe.Manchado ? (
              <Text style={{fontWeight: 'bold', color: '#31618C'}}>
                Manchado: {EstadoCafe.Manchado}
              </Text>
            ) : null}
            {EstadoCafe.Cereza ? (
              <Text style={{fontWeight: 'bold', color: '#31618C'}}>
                Cereza: {EstadoCafe.Cereza}
              </Text>
            ) : null}
            {EstadoCafe.Otros ? (
              <Text style={{fontWeight: 'bold', color: '#31618C'}}>
                Otros: {EstadoCafe.Otros}
              </Text>
            ) : null}

            {EstadoCafe.Otros ? (
              <Text style={{fontWeight: 'bold', color: '#31618C'}}>
                Materia Extraña:
              </Text>
            ) : null}
          </View>
        ) : null}

        <View
          style={{
            marginRight: '20%',
            marginLeft: '20%',
            backgroundColor: '#96999C',
            height: 70,
            borderRadius: 10,
            padding: 3,
            marginBottom: 15,
          }}>
          <Text style={{fontWeight: 'bold', color: 'white', fontSize: 17}}>
            Observacion: {Observacion ? Observacion : '  Sin observacion'}
          </Text>
        </View>

        <View
          style={{
            width: 320,
            marginLeft: 'auto',
            marginRight: 'auto',
            flexDirection: 'row',
        
          }}>
          <View style={{marginRight: 35}}>
            <Button
              icon="printer"
              color="#3F8C4D"
              mode="contained"
              onPress={() => printText()}>
              Imprimir
            </Button>
          </View>

          <Button
            icon="delete"
            color="#B64E40"
            mode="contained"
            onPress={() => printText()}>
            Anular
          </Button>
        </View>
      </View>

      <IconButton
        style={{position: 'absolute'}}
        icon="printer"
        size={35}
        onPress={() => setImpresora(true)}
      />
    </>
  );
}

const styles = StyleSheet.create({});
