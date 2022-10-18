import {StyleSheet, Text, ToastAndroid, View} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
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
  DataTable,
} from 'react-native-paper';
import LoadingLogin from '../../Loading/LoadingLogin';
import {Icon} from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import {refreshGlobal} from '../../../Context/Context';
import {getDBConnection} from '../../../Utils/db';
import {size} from 'lodash';
import {
  BluetoothManager,
  BluetoothEscposPrinter,
  BluetoothTscPrinter,
} from 'tp-react-native-bluetooth-printer';
import moment from 'moment';
import {ScrollView} from 'react-native-gesture-handler';

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
    Id,
    Correlativo,
  } = params.Nota;

 

  const [Impresora, setImpresora] = useState(false);
  const [Anular, setAnular] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [TexFiel, setTexFiel] = useState('');
  const [VisibleBene, setVisibleBene] = useState(false);
  const [Descuebto, setDescuebto] = useState({
    Verde: 0,
    Brocado: 0,
    Seco: 0,
    Mordido: 0,
    Negro: 0,
    Pulpa: 0,
    Pelado: 0,
    Inmaduro: 0,
    Manchado: 0,
    Cereza: 0,
    Otros: 0,
    Materia: 0,
  });
  const [SumaDes, setSumaDes] = useState(0);
  const [SoloSuma, setSoloSuma] = useState(0);
  const [Neto, setNeto] = useState({
    desc: 0,
    total: 0,
  });

  useEffect(() => {
    let Verde = Number(EstadoCafe.Frutoverde) / Number(Muestras);
    let Brocado = (Number(EstadoCafe.FrutoBrocado) * 0.5) / Number(Muestras);
    let Seco = (Number(EstadoCafe.Frutoseco) * 0.5) / Number(Muestras);
    let Mordido = Number(EstadoCafe.Mordido) / Number(Muestras);
    let Negro = Number(EstadoCafe.Negro) / Number(Muestras);
    let Pulpa = Number(EstadoCafe.Pulpa) / Number(Muestras);
    let Pelado = Number(EstadoCafe.Pelado) / Number(Muestras);
    let Inmaduro = Number(EstadoCafe.Inmaduro) / Number(Muestras);
    let Manchado = Number(EstadoCafe.Manchado) / Number(Muestras);
    let Cereza = Number(EstadoCafe.Cereza) / Number(Muestras);
    let Otros = Number(EstadoCafe.Otros) / Number(Muestras);
    let Materia = Number(EstadoCafe.Materia) / Number(Muestras);

    setDescuebto({
      ...Descuebto,
      Verde: Verde,
      Brocado: Brocado,
      Seco: Seco,
      Mordido: Mordido,
      Negro: Negro,
      Pulpa: Pulpa,
      Pelado: Pelado,
      Inmaduro: Inmaduro,
      Manchado: Manchado,
      Cereza: Cereza,
      Otros: Otros,
      Materia: Materia,
    });

    let suma =
      Verde +
      Brocado +
      Seco +
      Mordido +
      Negro +
      Pulpa +
      Pelado +
      Inmaduro +
      Manchado +
      Cereza +
      Otros +
      Materia;

    setSoloSuma(suma);

    if (Tipo === 'Pergamino') {
      if (suma > 6.5) {
        setSumaDes(suma - 6.5);
        let neto = Number(SumaLibras) - Number(SumaSacos);
        let descu = (suma - 6.5) / 100;

        let TotalNeto = neto - neto * descu;
        setNeto({...Neto, desc: neto * descu, total: TotalNeto});
      } else {
        let neto = Number(SumaLibras) - Number(SumaSacos);
        setSumaDes(0);
        setNeto({...Neto, desc: 0, total: neto});
      }
    } else {
      if (suma > 8.5) {
        setSumaDes(suma - 8.5);
        let neto = Number(SumaLibras) - Number(SumaSacos);
        let descu = (suma - 8.5) / 100;
        let TotalNeto = neto - neto * descu;
        setNeto({...Neto, desc: neto * descu, total: TotalNeto});
      } else {
        let neto = Number(SumaLibras) - Number(SumaSacos);
        setSumaDes(0);
        setNeto({...Neto, desc: 0, total: neto});
      }
    }
  }, []);

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

    await BluetoothEscposPrinter.printText('\n\rReimpresion\n\r', {
      encoding: 'GBK',
      codepage: 0,
      widthtimes: 1,
      heigthtimes: 0.5,
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

    await BluetoothEscposPrinter.printText('Nota de peso: F-RP-SC-72\n\r', {
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
    await BluetoothEscposPrinter.printText(
      `Nota de peso NO: CI-${Correlativo}\n\r`,
      {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
      },
    );

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

    {
      params.data === 'Pergamino'
        ? await BluetoothEscposPrinter.printText(
            `Total: (${SoloSuma.toFixed(2)}-6.5)=${SumaDes.toFixed(2)}%\n\r`,
            {
              encoding: 'GBK',
              codepage: 0,
              widthtimes: 0,
              heigthtimes: 0,
            },
          )
        : await BluetoothEscposPrinter.printText(
            `Descuento: (${SoloSuma.toFixed(2)}-8.5)=${SumaDes.toFixed(
              2,
            )}%\n\r`,
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

    await BluetoothEscposPrinter.printText(`Tara: ${SumaSacos}\n\r`, {
      encoding: 'GBK',
      codepage: 0,
      widthtimes: 0,
      heigthtimes: 0,
    });

    await BluetoothEscposPrinter.printText(
      `Peso Neto: ${Neto.total.toFixed(2)}\n\r`,
      {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
      },
    );

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
      `Fecha de Impresion: ${moment().format('DD/MM/YYYY')}\n\r`,
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
      '\n\r\n\r\n\r-----Comprobante Cliente-----\n\r',
      {},
    );
    await BluetoothEscposPrinter.printText(
      '\n\r-------Fin de Linea-------\n\r',
      {},
    );

    setTimeout(() => {
      setVisibleBene(true);
    }, 4000);
    setVisibleBene(false);
  };

  const printText2 = async () => {
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

    await BluetoothEscposPrinter.printText('\n\rReimpresion\n\r', {
      encoding: 'GBK',
      codepage: 0,
      widthtimes: 1,
      heigthtimes: 0.5,
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

    await BluetoothEscposPrinter.printText('Nota de peso: F-RP-SC-72\n\r', {
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
    await BluetoothEscposPrinter.printText(
      `Nota de peso NO: CI-${Correlativo}\n\r`,
      {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
      },
    );

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

    {
      params.data === 'Pergamino'
        ? await BluetoothEscposPrinter.printText(
            `Total: (${SoloSuma.toFixed(2)}-6.5)=${SumaDes.toFixed(2)}%\n\r`,
            {
              encoding: 'GBK',
              codepage: 0,
              widthtimes: 0,
              heigthtimes: 0,
            },
          )
        : await BluetoothEscposPrinter.printText(
            `Descuento: (${SoloSuma.toFixed(2)}-8.5)=${SumaDes.toFixed(
              2,
            )}%\n\r`,
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

    await BluetoothEscposPrinter.printText(`Tara: ${SumaSacos}\n\r`, {
      encoding: 'GBK',
      codepage: 0,
      widthtimes: 0,
      heigthtimes: 0,
    });

    await BluetoothEscposPrinter.printText(
      `Peso Neto: ${Neto.total.toFixed(2)}\n\r`,
      {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
      },
    );

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
      `Fecha de Impresion: ${moment().format('DD/MM/YYYY')}\n\r`,
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

    setTimeout(() => {
      setVisibleBene(true);
    }, 4000);
    setVisibleBene(false);
  };

  const {setRefreshConsulta} = useContext(refreshGlobal);

  const AnularNota = async () => {
    setRefreshConsulta(true);
    setAnular(false);
    const db = await getDBConnection();
    const UpdateQuery = `UPDATE Notas set Estado = '2', SumaLibras = '0', Pesos = '[{}]', SumaLibras = '0', Muestras = '0', SumaSacos = '0', Descuentos = '[{}]' WHERE id = ${Id};`;
    await db.executeSql(UpdateQuery);
    setRefreshConsulta(false);
    setLoading(false);
    navigation.navigate('Pantalla1');
  };

  const hideDialog = () => setAnular(false);
  const hideDialog2 = () => setVisibleBene(false);

  const ValidarAnular = () => {
    if (TexFiel === 'Anular') {
      setLoading(true);
      AnularNota();
    } else {
      ToastAndroid.show('Digite "Anular"!', 3000);
    }
  };

  return (
    <>
      <LoadingLogin isVisible={Loading} text="Anulando..." />
      <ModalImpresora Impresora={Impresora} setImpresora={setImpresora} />

      <ScrollView>
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
            style={
              Number(Estado) === 1
                ? {color: '#58B156', fontWeight: 'bold', textAlign: 'center'}
                : Number(Estado) === 2
                ? {color: '#C26262', fontWeight: 'bold', textAlign: 'center'}
                : {color: '#4B82BA', fontWeight: 'bold', textAlign: 'center'}
            }>
            Estado:{' '}
            {Number(Estado) === 1
              ? 'Pendiente de Enviar'
              : Number(Estado) === 2
              ? 'Anulada'
              : 'Sicronizada'}
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

        {size(Pesos) > 0 ? (
          <DataTable>
            <DataTable.Header>
              <DataTable.Title numeric></DataTable.Title>
              <DataTable.Title numeric>Peso</DataTable.Title>
              <DataTable.Title numeric>Sacos</DataTable.Title>
            </DataTable.Header>

            {Pesos.map((item, index) => (
              <DataTable.Row>
                <DataTable.Cell>Libras</DataTable.Cell>
                <DataTable.Cell numeric>{item.Libras}</DataTable.Cell>
                <DataTable.Cell numeric>{item.Sacos}</DataTable.Cell>
              </DataTable.Row>
            ))}

            <DataTable.Row>
              <DataTable.Cell>
                <Text style={{fontWeight: 'bold', textAlign: 'center'}}>
                  Total
                </Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <Text style={{fontWeight: 'bold', textAlign: 'center'}}>
                  {SumaLibras}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <Text style={{fontWeight: 'bold', textAlign: 'center'}}>
                  {SumaSacos}
                </Text>
              </DataTable.Cell>
            </DataTable.Row>
          </DataTable>
        ) : null}

        {/* <View style={{flexDirection: 'row', margin: 15}}>
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
        </View> */}

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
              <Text style={{fontWeight: 'bold', color: '#31618C'}}>
                Humedad: {EstadoCafe.Humedad}%
              </Text>
            ) : null}

            {EstadoCafe.Frutoverde ? (
              <Text style={{fontWeight: 'bold', color: '#31618C'}}>
                Fruto verde: {EstadoCafe.Frutoverde}Uds{'   '}
                {Descuebto.Verde.toFixed(2)}%
              </Text>
            ) : null}

            {EstadoCafe.FrutoBrocado ? (
              <Text style={{fontWeight: 'bold', color: '#31618C'}}>
                Fruto Brocado: {EstadoCafe.FrutoBrocado}(Uds){'   '}
                {Descuebto.Brocado.toFixed(2)}%
              </Text>
            ) : null}

            {EstadoCafe.Frutoseco ? (
              <Text style={{fontWeight: 'bold', color: '#31618C'}}>
                Fruto seco: {EstadoCafe.Frutoseco}(Uds){'   '}
                {Descuebto.Seco.toFixed(2)}%
              </Text>
            ) : null}

            {EstadoCafe.Mordido ? (
              <Text style={{fontWeight: 'bold', color: '#31618C'}}>
                Mordido: {EstadoCafe.Mordido}(Uds){'   '}
                {Descuebto.Mordido.toFixed(2)}%
              </Text>
            ) : null}
            {EstadoCafe.Negro ? (
              <Text style={{fontWeight: 'bold', color: '#31618C'}}>
                Negro: {EstadoCafe.Negro}(Uds)
                {'   '}
                {Descuebto.Negro.toFixed(2)}%
              </Text>
            ) : null}
            {EstadoCafe.Pulpa ? (
              <Text style={{fontWeight: 'bold', color: '#31618C'}}>
                Pulpa: {EstadoCafe.Pulpa}(Uds)
                {'   '}
                {Descuebto.Pulpa.toFixed(2)}%
              </Text>
            ) : null}
            {EstadoCafe.Pelado ? (
              <Text style={{fontWeight: 'bold', color: '#31618C'}}>
                Pelado: {EstadoCafe.Pelado}(Uds)
                {'   '}
                {Descuebto.Pelado.toFixed(2)}%
              </Text>
            ) : null}
            {EstadoCafe.Inmaduro ? (
              <Text style={{fontWeight: 'bold', color: '#31618C'}}>
                Inmaduro: {EstadoCafe.Inmaduro}(Uds)
                {'   '}
                {Descuebto.Inmaduro.toFixed(2)}%
              </Text>
            ) : null}
            {EstadoCafe.Manchado ? (
              <Text style={{fontWeight: 'bold', color: '#31618C'}}>
                Manchado: {EstadoCafe.Manchado}(Uds)
                {'   '}
                {Descuebto.Manchado.toFixed(2)}%
              </Text>
            ) : null}
            {EstadoCafe.Cereza ? (
              <Text style={{fontWeight: 'bold', color: '#31618C'}}>
                Cereza: {EstadoCafe.Cereza}(Uds)
                {'   '}
                {Descuebto.Cereza.toFixed(2)}%
              </Text>
            ) : null}
            {EstadoCafe.Otros ? (
              <Text style={{fontWeight: 'bold', color: '#31618C'}}>
                Otros: {EstadoCafe.Otros}(Uds)
                {'   '}
                {Descuebto.Otros.toFixed(2)}%
              </Text>
            ) : null}

            {EstadoCafe.Materia ? (
              <Text style={{fontWeight: 'bold', color: '#31618C'}}>
                Materia Extraña: {EstadoCafe.Materia}(Uds)
                {'   '}
                {Descuebto.Materia.toFixed(2)}%
              </Text>
            ) : null}
          </View>
        ) : null}

        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            color: 'black',
            fontSize: 20,
            marginLeft: 15,
          }}>
          Tara : {SumaSacos}
        </Text>
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            color: 'black',
            fontSize: 20,
            marginLeft: 15,
          }}>
          P. Bruto : {SumaLibras}
        </Text>
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            color: 'black',
            fontSize: 20,
            marginLeft: 15,
          }}>
          Descuento {SumaDes.toFixed(2)}%
        </Text>

        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            color: 'black',
            fontSize: 20,
            marginLeft: 15,
            borderTopWidth: 1,
            borderStyle: 'solid',
          }}>
          P. Neto : {Neto.total.toFixed(2)}
        </Text>

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
            // width: 320,
            marginLeft: 'auto',
            marginRight: 'auto',
            // flexDirection: 'row',
            // backgroundColor: "red"
          }}>
          <View style={{marginBottom: 20}}>
            <Button
              icon="printer"
              color="#3F8C4D"
              mode="contained"
              onPress={() => printText()}>
              Reimprimir
            </Button>
          </View>

          {Number(Estado) === 2 ? null : (
            <Button
              icon="delete"
              disabled={Fecha === moment().format('DD/MM/YYYY') ? false : true}
              color="#B64E40"
              mode="contained"
              onPress={() => setAnular(true)}>
              Anular
            </Button>
          )}
        </View>
      </ScrollView>

      <IconButton
        style={{position: 'absolute'}}
        icon="printer"
        size={35}
        onPress={() => setImpresora(true)}
      />

      <Portal>
        <Dialog visible={Anular} onDismiss={hideDialog}>
          <Dialog.Content>
            <Paragraph style={{fontWeight: 'bold', fontSize: 20}}>
              Digite "Anular" Para Confirmar
            </Paragraph>
            <View
              style={{marginLeft: 'auto', marginRight: 'auto', marginTop: 25}}>
              <View style={{width: 200}}>
                <TextInput
                  style={styles.inputCa}
                  label="Anular "
                  maxLength={6}
                  value={TexFiel}
                  selectionColor="#598A99"
                  activeOutlineColor="#598A99"
                  error={TexFiel === 'Anular' ? false : true}
                  keyboardType="default"
                  right={
                    <TextInput.Icon
                      style={styles.icon}
                      type="material-community"
                      name="delete-circle-outline"
                      size={30}
                      color="black"
                    />
                  }
                  onChangeText={valor => {
                    setTexFiel(valor);
                  }}
                />
              </View>
            </View>

            <View
              style={{marginLeft: 'auto', marginRight: 'auto', marginTop: 25}}>
              <View style={{width: 250}}>
                <Button
                  icon="close"
                  mode="contained"
                  color="red"
                  onPress={() => ValidarAnular()}>
                  Confirmar
                </Button>
              </View>
            </View>
          </Dialog.Content>
        </Dialog>
      </Portal>

      <Portal>
        <Dialog visible={VisibleBene} onDismiss={hideDialog2}>
          <Dialog.Content>
            <Paragraph style={{fontWeight: 'bold', fontSize: 18}}>
              Reimprimir Comprobante de Beneficio?
            </Paragraph>

            <Button
              icon="printer"
              mode="contained"
              onPress={() => {
                printText2();
                hideDialog2();
              }}>
              Reimprimir
            </Button>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({});
