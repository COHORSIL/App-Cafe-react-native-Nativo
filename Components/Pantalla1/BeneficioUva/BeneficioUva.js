import {
  StyleSheet,
  Text,
  View,
  Alert,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import Stepper from 'react-native-stepper-ui';
import moment from 'moment/moment';
import LottiePeso from '../../Lottie/LottiePeso';
import {Icon, SearchBar} from 'react-native-elements';
import ActionSheet, {SheetManager} from 'react-native-actions-sheet';
import {
  Button,
  TextInput,
  Card,
  IconButton,
  Paragraph,
  Dialog,
  Portal,
  DataTable,
} from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {size, map} from 'lodash';
import {refreshGlobal} from '../../../Context/Context';
import jwt_decode from 'jwt-decode';
import * as Animatable from 'react-native-animatable';
import {
  getDBConnection,
  getTablaMarcas,
  getTablaPropietario,
  insertTablaNotas,
} from '../../../Utils/db';
import {Beneficio} from '../../../Utils/Api';
import Usuario from '../../../Hooks/Usuario';
import uuid from 'react-native-uuid';
import ModalImpresora from '../../ModalImpresora/ModalImpresora';
import LoadingLogin from '../../Loading/LoadingLogin';
import {
  BluetoothManager,
  BluetoothEscposPrinter,
  BluetoothTscPrinter,
} from 'tp-react-native-bluetooth-printer';
moment.locale('es');

export default function BeneficioUva(props) {
  const {navigation} = props;
  const {params} = props.route;
  navigation.setOptions({title: `Cafe ${params.data}`});

  const [active, setActive] = useState(0);

  //State de Cliente
  const [Beneficio, setBeneficio] = useState([]);
  const [Marca, setMarca] = useState([]);
  const [NMarca, setNMarca] = useState([]);
  const [Propie, setPropie] = useState('1');
  const [Npropie, setNpropie] = useState([]);
  const [Cliente, setCliente] = useState([]);
  const [Correlati, setCorrelati] = useState([]);

  //State de Pesos
  const [Pesos, setPesos] = useState([]);
  const [SumaLibras, setSumaLibras] = useState([]);
  const [Muestras, setMuestras] = useState([]);
  const [SumaSacos, setSumaSacos] = useState([]);

  //State de Estado

  const [PrecioFijado, setPrecioFijado] = useState({
    value: 'No',
  });
  const [Altura, setAltura] = useState({
    value: 'STD',
  });
  const [EstadoCafe, setEstadoCafe] = useState({
    Humedad: '',
    Frutoverde: '',
    FrutoBrocado: '',
    Frutoseco: '',
    Materia: '',
    Mordido: '',
    Negro: '',
    Pulpa: '',
    Pelado: '',
    Inmaduro: '',
    Manchado: '',
    Cereza: '',
    Otros: '',
  });
  const [Observacion, setObservacion] = useState([]);

  const content = [
    <DatosCliente
      setBeneficio={setBeneficio}
      Benefic={Beneficio}
      setMarca={setMarca}
      Marca={Marca}
      setCliente={setCliente}
      Cliente={Cliente}
      setNMarca={setNMarca}
      Propie={Propie}
      setPropie={setPropie}
      setNpropie={setNpropie}
      setCorrelati={setCorrelati}
      Correlati={Correlati}
    />,
    <AgregarPesos
      setPesos={setPesos}
      Pesos={Pesos}
      SumaLibras={SumaLibras}
      setSumaLibras={setSumaLibras}
      Muestras={Muestras}
      setMuestras={setMuestras}
      SumaSacos={SumaSacos}
      setSumaSacos={setSumaSacos}
    />,
    <Estado
      PrecioFijado={PrecioFijado}
      setPrecioFijado={setPrecioFijado}
      Altura={Altura}
      setAltura={setAltura}
      EstadoCafe={EstadoCafe}
      setEstadoCafe={setEstadoCafe}
      Observacion={Observacion}
      setObservacion={setObservacion}
      params={params}
      Muestras={Muestras}
    />,
    <FinalGuardar
      Beneficio={Beneficio}
      Marca={Marca}
      Cliente={Cliente}
      Pesos={Pesos}
      SumaLibras={SumaLibras}
      Muestras={Muestras}
      SumaSacos={SumaSacos}
      PrecioFijado={PrecioFijado}
      Altura={Altura}
      EstadoCafe={EstadoCafe}
      Observacion={Observacion}
      navigation={navigation}
      params={params}
      NMarca={NMarca}
      Propie={Propie}
      Npropie={Npropie}
      Correlati={Correlati}
    />,
  ];

  const Nextclientes = () => {
    if (active === 0) {
      if (size(Marca) <= 0) {
        ToastAndroid.show('Seleccione Una Marca!', 3000);
        return;
      }

      if (Cliente == '') {
        ToastAndroid.show('Seleccione Cliente!', 3000);
        return;
      }
      setActive(p => p + 1);

      return;
    }

    if (active === 1) {
      if (size(Pesos) <= 0) {
        ToastAndroid.show('Agregue Pesos!', 3000);
        return;
      }
      setActive(p => p + 1);

      return;
    }

    setActive(p => p + 1);
  };

  return (
    <>
      <ScrollView style={{marginHorizontal: 20}}>
        <Stepper
          active={active}
          content={content}
          onNext={Nextclientes}
          onBack={() => setActive(p => p - 1)}
          onFinish={() => Alert.alert('Finish')}></Stepper>
      </ScrollView>
    </>
  );
}

function DatosCliente({
  setBeneficio,
  Benefic,
  Marca,
  setMarca,
  setCliente,
  Cliente,
  setNMarca,
  Propie,
  setPropie,
  setNpropie,
  Correlati,
  setCorrelati,
}) {
  const [searchi, setSearchi] = useState('');
  const [Searcresul, setSearcresul] = useState([]);
  const [Marcasdata, setMarcasdata] = useState([]);
  const [PropietarioDatos, setPropietarioDatos] = useState([]);

  useEffect(() => {
    ObtenerDatosMarcas();
    ObtenerDatosPropietario();
    ClientesPre();
    Beneficios();
    Correlativo();
  }, []);

  const {token} = Usuario();

  const ObtenerDatosMarcas = async () => {
    try {
      const db = await getDBConnection();
      const taskdatabase = await getTablaMarcas(db);
      setMarcasdata(taskdatabase);
    } catch (error) {
      console.log(error);
    }
  };

  const ObtenerDatosPropietario = async () => {
    try {
      const db = await getDBConnection();
      const taskdatabase = await getTablaPropietario(db);
      setPropietarioDatos(taskdatabase);
    } catch (error) {
      console.log(error);
    }
  };

  const handlebuscar = e => {
    setSearchi(e);
    filtrar(e);
  };

  const filtrar = async terminoBusqueda => {
    const db = await getDBConnection();
    try {
      const task = [];
      const results = await db.executeSql(
        `SELECT * FROM Clientes WHERE Nombre LIKE '%${terminoBusqueda}%' LIMIT 30 `,
      );
      results.forEach(result => {
        for (let index = 0; index < result.rows.length; index++) {
          task.push(result.rows.item(index));
        }
      });
      console.log(task.length);
      setSearcresul(task);
    } catch (error) {
      console.error(error);
      throw Error('Error al obtener los datos !!!');
    }
  };

  const ClientesPre = async () => {
    const db = await getDBConnection();
    try {
      const task = [];
      const results = await db.executeSql(
        `SELECT * FROM Clientes WHERE Nombre LIKE 'a%' LIMIT 30 `,
      );
      results.forEach(result => {
        for (let index = 0; index < result.rows.length; index++) {
          task.push(result.rows.item(index));
        }
      });
      setSearcresul(task);
    } catch (error) {
      console.error(error);
      throw Error('Error al obtener los datos !!!');
    }
  };

  const Beneficios = async () => {
    const value = await AsyncStorage.getItem('Beneficio');

    if (value !== null) {
      setBeneficio(JSON.parse(value));
    } else {
    }
  };

  const ConsultaMarca = async value => {
    const db = await getDBConnection();
    try {
      const task = [];
      const results = await db.executeSql(
        `SELECT * FROM Marcas WHERE value LIKE ${value}`,
      );
      results.forEach(result => {
        for (let index = 0; index < result.rows.length; index++) {
          task.push(result.rows.item(index));
        }
      });
      if (size(task) > 0) {
        setMarca(task[0].value);
        setNMarca(task[0].label);
      }
    } catch (error) {
      console.error(error);
      throw Error('Error al obtener los datos !!!');
    }
  };

  const ConsultaPro = async value => {
    const db = await getDBConnection();
    try {
      const task = [];
      const results = await db.executeSql(
        `SELECT * FROM Propietario WHERE value LIKE ${value}`,
      );
      results.forEach(result => {
        for (let index = 0; index < result.rows.length; index++) {
          task.push(result.rows.item(index));
        }
      });
      if (size(task) > 0) {
        setPropie(task[0].value);
        setNpropie(task[0].label);
      }
    } catch (error) {
      console.error(error);
      throw Error('Error al obtener los datos !!!');
    }
  };

  const Correlativo = async () => {
    const value = await AsyncStorage.getItem('Correlativo');

    if (value !== null) {
      setCorrelati(value);
    }
  };

  return (
    <>
      <View>
        <Text style={{textAlign: 'center'}}>Cliente</Text>
      </View>

      <View style={{flexDirection: 'row', marginTop: 19}}>
        <View
          style={{
            flexDirection: 'row',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
          <Icon
            type="material-community"
            name="counter"
            size={25}
            color="#BD5F4B"
          />
          {size(Correlati) > 0 ? (
            <Text style={styles.Title}>
              No. Factura: {Number(Correlati) + 1}
            </Text>
          ) : (
            <Text style={styles.Title}>No. Factura: </Text>
          )}
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
          <Icon
            type="material-community"
            name="calendar-month"
            size={25}
            color="#83C779"
          />
          <Text style={styles.Title}>Fecha: {moment().format('L')}</Text>
        </View>
      </View>

      <View>
        <Text
          style={{
            position: 'absolute',
            color: 'black',
            top: 20,
            left: '10%',
            color: '#909090',
          }}>
          Beneficio
        </Text>
        <View style={{width: '10%', marginTop: 15}}>
          <Icon
            style={styles.icon}
            type="material-community"
            name="greenhouse"
            size={35}
            color="#909090"
          />
        </View>

        <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 18}}>
          {Benefic.Nombre ? Benefic.Nombre.toUpperCase() : 'Sin Beneficios'}
        </Text>
      </View>

      <View>
        <Text
          style={{
            position: 'absolute',
            color: 'black',
            top: 20,
            left: '10%',
            color: '#909090',
          }}>
          Marca
        </Text>
        <View style={{width: '10%', marginTop: 15}}>
          <Icon
            style={styles.icon}
            type="material-community"
            name="checkbox-marked-circle-outline"
            size={35}
            color="#909090"
          />
        </View>

        {size(Marcasdata) > 0 ? (
          <View
            style={{
              backgroundColor: '#909090',
              borderRadius: 10,
              width: '80%',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
            <RNPickerSelect
              placeholder={{
                label: 'Seleccione una Marca',
                value: null,
              }}
              onValueChange={value => ConsultaMarca(value)}
              items={Marcasdata}
              value={Marca ? Marca : null}
            />
          </View>
        ) : (
          <Text style={{color: 'black'}}>Sin datos</Text>
        )}
      </View>

      <View>
        <Text
          style={{
            position: 'absolute',
            color: 'black',
            top: 20,
            left: '10%',
            color: '#909090',
          }}>
          Propietario
        </Text>
        <View style={{width: '10%', marginTop: 15}}>
          <Icon
            style={styles.icon}
            type="material-community"
            name="checkbox-marked-circle-outline"
            size={35}
            color="#909090"
          />
        </View>

        {size(PropietarioDatos) > 0 ? (
          <View
            style={{
              backgroundColor: '#909090',
              borderRadius: 10,
              width: '80%',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
            <RNPickerSelect
              placeholder={{
                label: 'Seleccione un Propietario',
                value: null,
              }}
              onValueChange={value => ConsultaPro(value)}
              items={PropietarioDatos}
              value={Propie ? Propie : null}
            />
          </View>
        ) : (
          <Text style={{color: 'black'}}>Sin datos</Text>
        )}
      </View>

      {size(Cliente) > 0 ? (
        <Animatable.View
          animation="fadeInUpBig"
          style={styles.profileContainer}>
          <View style={styles.textcontedata}>
            <Text
              style={{
                fontWeight: 'bold',
                color: '#4988A0',
                textAlign: 'center',
                fontSize: 15,
              }}>
              Informacion cliente/Socio
            </Text>

            <View style={styles.contenedortitle}>
              <View style={styles.iconleft}>
                <Icon
                  type="material-community"
                  name="account-box"
                  size={22}
                  color="#00a680"
                />
              </View>
              <Text style={styles.Contad2}>{Cliente.Nombre}</Text>
            </View>

            {Cliente.Identidad ? (
              <View style={styles.contenedortitle}>
                <View style={styles.iconleft}>
                  <Icon
                    type="material-community"
                    name="card-bulleted"
                    size={22}
                    color="#00a680"
                  />
                </View>
                <Text style={styles.Contad2}>{Cliente.Identidad}</Text>
              </View>
            ) : null}

            {Cliente.direccion ? (
              <View style={styles.contenedortitle}>
                <View style={styles.iconleft}>
                  <Icon
                    type="material-community"
                    name="file-image-marker"
                    size={22}
                    color="#00a680"
                  />
                </View>
                <Text style={styles.Contad2}>{Cliente.direccion}</Text>
              </View>
            ) : null}

            {Cliente.telefono ? (
              <View style={styles.contenedortitle}>
                <View style={styles.iconleft}>
                  <Icon
                    type="material-community"
                    name="phone"
                    size={22}
                    color="#00a680"
                  />
                </View>
                <Text style={styles.Contad2}>{Cliente.telefono}</Text>
              </View>
            ) : null}

            <View
              style={{
                flexDirection: 'row',
                marginRight: 'auto',
                marginLeft: 'auto',
              }}>
              <Button icon="delete" onPress={() => setCliente([])} color="red">
                Eliminar
              </Button>
            </View>
          </View>
        </Animatable.View>
      ) : (
        <View
          style={{
            marginTop: 20,
            marginBottom: 15,
            marginLeft: '10%',
            marginRight: '10%',
          }}>
          <Button
            icon="account-plus"
            mode="contained"
            onPress={() => SheetManager.show('helloworld_sheet')}
            style={{backgroundColor: '#53915C', color: 'white'}}>
            Buscar Cliente
          </Button>
        </View>
      )}

      <ActionSheet id="helloworld_sheet">
        <SearchBar
          placeholder="Buscar Cliente..."
          onChangeText={e => handlebuscar(e)}
          value={searchi}
          containerStyle={styles.searchBar}
        />

        <ScrollView style={{height: '100%'}}>
          {size(Searcresul) > 0 ? (
            <>
              {Searcresul.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setCliente(item);
                    SheetManager.hide('helloworld_sheet');
                  }}>
                  <Text
                    style={{
                      textAlign: 'left',
                      fontWeight: 'bold',
                      color: '#878581',
                      fontSize: 10,
                    }}>
                    #{item.Identidad}
                  </Text>

                  <View
                    style={{
                      backgroundColor: 'white',
                      borderBottomWidth: 1,
                      borderColor: '#eeeeee',
                      flexDirection: 'row',
                      height: 40,
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: 'black',
                        marginLeft: 15,
                      }}>
                      {item.Nombre.trim().toUpperCase()}
                    </Text>
                  </View>

                  {item.direccion ? (
                    <View
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 30,
                        flexDirection: 'row',
                      }}>
                      <Icon
                        style={styles.icon}
                        type="material-community"
                        name="map-marker"
                        size={15}
                        color="#909090"
                      />
                      <Text
                        style={{
                          textAlign: 'center',
                          fontWeight: 'bold',
                          color: '#878581',
                          fontSize: 11,
                        }}>
                        {item.direccion.toUpperCase()}
                      </Text>
                    </View>
                  ) : null}
                </TouchableOpacity>
              ))}
            </>
          ) : null}
        </ScrollView>
        <View style={{display: 'flex', alignItems: 'center'}}>
          <Button
            style={{
              position: 'absolute',
              bottom: 10,
              backgroundColor: 'red',
            }}
            icon="close"
            onPress={() => {
              setCliente([]);
              SheetManager.hide('helloworld_sheet');
            }}
            color="white">
            Cerrar
          </Button>
        </View>
      </ActionSheet>
    </>
  );
}

function AgregarPesos({
  setPesos,
  Pesos,
  SumaLibras,
  setSumaLibras,
  Muestras,
  setMuestras,
  SumaSacos,
  setSumaSacos,
}) {
  const [Datospesos, setDatospesos] = useState({
    Sacos: '',
    Libras: '',
    Id: '',
  });

  //temporal
  const [Item, setItem] = useState([]);

  useEffect(() => {
    setDatospesos({...Datospesos, Id: uuid.v4()});
  }, [Pesos]);

  const GuardarPeso = datos => {
    setPesos([...Pesos, datos]);
  };

  const AddPeso = () => {
    let calcularMuestras = 0;

    if (Number(Datospesos.Sacos) > Number(Datospesos.Libras)) {
      ToastAndroid.show('Las Libras tienen que ser mayor a los Sacos!', 3000);
      return;
    }

    map(Pesos, item => {
      calcularMuestras = calcularMuestras + Number(item.Sacos);
    });
    let Calculos = (calcularMuestras + Number(Datospesos.Sacos)) / 5;

    if (Math.round(Calculos) > 5) {
      ToastAndroid.show(
        `El maximos de Muestras son 5! ${
          25 > calcularMuestras
            ? `Sacos Aceptables ${25 - calcularMuestras}`
            : ``
        }`,
        3000,
      );
      return;
    }

    if (Number(Datospesos.Sacos) <= 0) {
      ToastAndroid.show('Ingrese el Numero de Sacos!', 3000);
      return;
    }

    if (Number(Datospesos.Libras) <= 0) {
      ToastAndroid.show('Ingrese las Libras!', 3000);
      return;
    }

    GuardarPeso(Datospesos);
    setDatospesos({...Datospesos, Libras: '', Sacos: ''});
    ToastAndroid.show('Peso Agregado!', 3000);
  };

  const Borrar = () => {
    const eliminarActividad = Pesos.filter(datos => datos.Id !== Item.Id);
    setPesos(eliminarActividad);
    setVisible(false);
  };

  useEffect(() => {
    let calcularsuma = 0;
    let calcularsumaLibras = 0;

    map(Pesos, item => {
      (calcularsuma = calcularsuma + Number(item.Sacos)),
        (calcularsumaLibras = calcularsumaLibras + Number(item.Libras));
    });

    let muestra = calcularsuma / 5;
    setMuestras(Math.ceil(muestra) > 5 ? 5 : Math.ceil(muestra));
    setSumaSacos(calcularsuma);
    setSumaLibras(calcularsumaLibras);
  }, [Pesos]);

  const [visible, setVisible] = useState(false);

  const showDialog = item => {
    setVisible(true);
    setItem(item);
  };

  const hideDialog = () => setVisible(false);

  return (
    <>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Eliminar Peso?</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Se Eliminara el peso Seleccionado</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancelar</Button>
            <Button onPress={Borrar}>Eliminar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Text style={{textAlign: 'center'}}>Agregar Pesos</Text>

      <View style={{marginRight: '20%', marginLeft: '20%'}}>
        <TextInput
          style={styles.inputCa}
          label="Numero de sacos "
          mode="outlined"
          selectionColor="#598A99"
          keyboardType="numeric"
          activeOutlineColor="#598A99"
          value={Datospesos.Sacos}
          right={
            <TextInput.Icon
              style={styles.icon}
              type="material-community"
              name="sack"
              size={30}
              color="black"
            />
          }
          onChangeText={valor => {
            setDatospesos({...Datospesos, Sacos: valor});
          }}
        />
      </View>

      <View style={{marginRight: '20%', marginLeft: '20%'}}>
        <TextInput
          mode="outlined"
          style={styles.inputCa}
          label="Peso en libras"
          value={Datospesos.Libras}
          selectionColor="#598A99"
          keyboardType="numeric"
          activeOutlineColor="#598A99"
          right={
            <TextInput.Icon
              style={styles.icon}
              type="material-community"
              name="weight-pound"
              size={30}
              color="black"
            />
          }
          onChangeText={valor => {
            setDatospesos({...Datospesos, Libras: valor});
          }}
        />
      </View>

      <View style={styles.button}>
        <TouchableOpacity
          colors={['#6FA3B9', '#6FA3B9']}
          style={styles.signIn}
          onPress={AddPeso}>
          <Icon
            style={styles.icon}
            type="material-community"
            name="circle-edit-outline"
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
            Agregar
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{flexDirection: 'row'}}>
        <View style={{width: '33%'}}>
          <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>
            Total Sacos: {SumaSacos}
          </Text>
        </View>

        <View style={{width: '33%'}}>
          <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>
            Total Libras: {SumaLibras}
          </Text>
        </View>

        <View style={{width: '33%'}}>
          <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>
            Muestra(s): {Muestras}
          </Text>
        </View>
      </View>

      {size(Pesos) > 0 ? (
        <>
          <ScrollView>
            {Pesos.map((item, index) => (
              <View key={index} style={{marginTop: 25}}>
                <Card style={{marginLeft: 10, marginRight: 10}}>
                  <Card.Content>
                    <View style={{flexDirection: 'row'}}>
                      <Icon
                        style={styles.icon}
                        type="material-community"
                        name="sack"
                        size={30}
                        color="black"
                      />

                      <Text
                        style={{
                          fontWeight: 'bold',
                          color: 'black',
                          fontSize: 19,
                        }}>
                        Numero de Sacos: {item.Sacos}
                      </Text>
                    </View>

                    <View style={{flexDirection: 'row'}}>
                      <Icon
                        style={styles.icon}
                        type="material-community"
                        name="weight-pound"
                        size={30}
                        color="black"
                      />

                      <Text
                        style={{
                          fontWeight: 'bold',
                          color: 'black',
                          fontSize: 19,
                        }}>
                        Peso en Libras: {item.Libras}
                      </Text>
                    </View>
                  </Card.Content>

                  <View
                    style={{
                      flexDirection: 'row',
                      position: 'absolute',
                      top: 0,
                      right: 0,
                    }}>
                    <IconButton
                      icon="delete"
                      iconColor="red"
                      color="red"
                      size={30}
                      onPress={() => showDialog(item)}
                    />
                  </View>
                </Card>
              </View>
            ))}
            <View style={{marginTop: 50}}>
              <Text style={{color: 'white'}}>.</Text>
            </View>
          </ScrollView>
        </>
      ) : (
        <View style={{marginLeft: 'auto', marginRight: 'auto'}}>
          <LottiePeso />
          <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 16}}>
            Sin Pesos!!!
          </Text>
        </View>
      )}
    </>
  );
}

function Estado({
  PrecioFijado,
  setPrecioFijado,
  Altura,
  setAltura,
  EstadoCafe,
  setEstadoCafe,
  Observacion,
  setObservacion,
  params,
  Muestras,
}) {
  return (
    <ScrollView>
      <Text style={{textAlign: 'center'}}> Muestras ({Muestras})</Text>

      {params.data === 'Uva' ? null : (
        <View style={{marginRight: '23%', marginLeft: '23%'}}>
          <TextInput
            style={styles.inputCa}
            label="Humedadad(Uds)"
            mode="outlined"
            selectionColor="#598A99"
            keyboardType="numeric"
            activeOutlineColor="#598A99"
            value={EstadoCafe.Humedad}
            right={
              <TextInput.Icon
                style={styles.icon}
                type="material-community"
                name="water-percent"
                size={30}
                color="black"
              />
            }
            onChangeText={valor => {
              setEstadoCafe({...EstadoCafe, Humedad: valor});
            }}
          />
        </View>
      )}

      {params.data === 'Pergamino' ? null : (
        <View style={{marginRight: '23%', marginLeft: '23%'}}>
          <TextInput
            mode="outlined"
            style={styles.inputCa}
            label="Fruto Verde(Uds)"
            value={EstadoCafe.Frutoverde}
            selectionColor="#598A99"
            keyboardType="numeric"
            activeOutlineColor="#598A99"
            right={
              <TextInput.Icon
                style={styles.icon}
                type="material-community"
                name="fruit-cherries"
                size={30}
                color="black"
              />
            }
            onChangeText={valor => {
              setEstadoCafe({...EstadoCafe, Frutoverde: valor});
            }}
          />
        </View>
      )}

      {params.data === 'Pergamino' ? null : (
        <View style={{marginRight: '23%', marginLeft: '23%'}}>
          <TextInput
            mode="outlined"
            style={styles.inputCa}
            label="Fruto Seco(Uds)"
            value={EstadoCafe.Frutoseco}
            selectionColor="#598A99"
            keyboardType="numeric"
            activeOutlineColor="#598A99"
            right={
              <TextInput.Icon
                style={styles.icon}
                type="material-community"
                name="fruit-grapes-outline"
                size={30}
                color="black"
              />
            }
            onChangeText={valor => {
              setEstadoCafe({...EstadoCafe, Frutoseco: valor});
            }}
          />
        </View>
      )}

      <View style={{marginRight: '23%', marginLeft: '23%'}}>
        <TextInput
          mode="outlined"
          style={styles.inputCa}
          label="Fruto Brocado(Uds)"
          value={EstadoCafe.FrutoBrocado}
          selectionColor="#598A99"
          keyboardType="numeric"
          activeOutlineColor="#598A99"
          right={
            <TextInput.Icon
              style={styles.icon}
              type="material-community"
              name="fruit-cherries-off"
              size={30}
              color="black"
            />
          }
          onChangeText={valor => {
            setEstadoCafe({...EstadoCafe, FrutoBrocado: valor});
          }}
        />
      </View>

      {params.data === 'Pergamino' ? (
        <View style={{marginRight: '23%', marginLeft: '23%'}}>
          <TextInput
            mode="outlined"
            style={styles.inputCa}
            label="Mordido(Uds)"
            value={EstadoCafe.Mordido}
            selectionColor="#598A99"
            keyboardType="numeric"
            activeOutlineColor="#598A99"
            right={
              <TextInput.Icon
                style={styles.icon}
                type="material-community"
                name="spa-outline"
                size={30}
                color="black"
              />
            }
            onChangeText={valor => {
              setEstadoCafe({...EstadoCafe, Mordido: valor});
            }}
          />
        </View>
      ) : null}

      {params.data === 'Pergamino' ? (
        <View style={{marginRight: '23%', marginLeft: '23%'}}>
          <TextInput
            mode="outlined"
            style={styles.inputCa}
            label="Negro(Uds)"
            value={EstadoCafe.Negro}
            selectionColor="#598A99"
            keyboardType="numeric"
            activeOutlineColor="#598A99"
            right={
              <TextInput.Icon
                style={styles.icon}
                type="material-community"
                name="spa-outline"
                size={30}
                color="black"
              />
            }
            onChangeText={valor => {
              setEstadoCafe({...EstadoCafe, Negro: valor});
            }}
          />
        </View>
      ) : null}

      {params.data === 'Pergamino' ? (
        <View style={{marginRight: '23%', marginLeft: '23%'}}>
          <TextInput
            mode="outlined"
            style={styles.inputCa}
            label="Pulpa(Uds)"
            value={EstadoCafe.Pulpa}
            selectionColor="#598A99"
            keyboardType="numeric"
            activeOutlineColor="#598A99"
            right={
              <TextInput.Icon
                style={styles.icon}
                type="material-community"
                name="spa-outline"
                size={30}
                color="black"
              />
            }
            onChangeText={valor => {
              setEstadoCafe({...EstadoCafe, Pulpa: valor});
            }}
          />
        </View>
      ) : null}

      {params.data === 'Pergamino' ? (
        <View style={{marginRight: '23%', marginLeft: '23%'}}>
          <TextInput
            mode="outlined"
            style={styles.inputCa}
            label="Pelado(Uds)"
            value={EstadoCafe.Pelado}
            selectionColor="#598A99"
            keyboardType="numeric"
            activeOutlineColor="#598A99"
            right={
              <TextInput.Icon
                style={styles.icon}
                type="material-community"
                name="spa-outline"
                size={30}
                color="black"
              />
            }
            onChangeText={valor => {
              setEstadoCafe({...EstadoCafe, Pelado: valor});
            }}
          />
        </View>
      ) : null}

      {params.data === 'Pergamino' ? (
        <View style={{marginRight: '23%', marginLeft: '23%'}}>
          <TextInput
            mode="outlined"
            style={styles.inputCa}
            label="Inmaduro(Uds)"
            value={EstadoCafe.Inmaduro}
            selectionColor="#598A99"
            keyboardType="numeric"
            activeOutlineColor="#598A99"
            right={
              <TextInput.Icon
                style={styles.icon}
                type="material-community"
                name="spa-outline"
                size={30}
                color="black"
              />
            }
            onChangeText={valor => {
              setEstadoCafe({...EstadoCafe, Inmaduro: valor});
            }}
          />
        </View>
      ) : null}

      {params.data === 'Pergamino' ? (
        <View style={{marginRight: '23%', marginLeft: '23%'}}>
          <TextInput
            mode="outlined"
            style={styles.inputCa}
            label="Manchado(Uds)"
            value={EstadoCafe.Manchado}
            selectionColor="#598A99"
            keyboardType="numeric"
            activeOutlineColor="#598A99"
            right={
              <TextInput.Icon
                style={styles.icon}
                type="material-community"
                name="spa-outline"
                size={30}
                color="black"
              />
            }
            onChangeText={valor => {
              setEstadoCafe({...EstadoCafe, Manchado: valor});
            }}
          />
        </View>
      ) : null}

      {params.data === 'Pergamino' ? (
        <View style={{marginRight: '23%', marginLeft: '23%'}}>
          <TextInput
            mode="outlined"
            style={styles.inputCa}
            label="Cereza(Uds)"
            value={EstadoCafe.Cereza}
            selectionColor="#598A99"
            keyboardType="numeric"
            activeOutlineColor="#598A99"
            right={
              <TextInput.Icon
                style={styles.icon}
                type="material-community"
                name="spa-outline"
                size={30}
                color="black"
              />
            }
            onChangeText={valor => {
              setEstadoCafe({...EstadoCafe, Cereza: valor});
            }}
          />
        </View>
      ) : null}

      <View style={{marginRight: '23%', marginLeft: '23%'}}>
        <TextInput
          mode="outlined"
          style={styles.inputCa}
          label="Otros(Uds)"
          value={EstadoCafe.Otros}
          selectionColor="#598A99"
          keyboardType="numeric"
          activeOutlineColor="#598A99"
          right={
            <TextInput.Icon
              style={styles.icon}
              type="material-community"
              name="spa-outline"
              size={30}
              color="black"
            />
          }
          onChangeText={valor => {
            setEstadoCafe({...EstadoCafe, Otros: valor});
          }}
        />
      </View>

      <View style={{marginRight: '23%', marginLeft: '23%'}}>
        <TextInput
          mode="outlined"
          style={styles.inputCa}
          label="Materia Extraña(Uds)"
          value={EstadoCafe.Materia}
          selectionColor="#598A99"
          keyboardType="numeric"
          activeOutlineColor="#598A99"
          right={
            <TextInput.Icon
              style={styles.icon}
              type="material-community"
              name="water-opacity"
              size={30}
              color="black"
            />
          }
          onChangeText={valor => {
            setEstadoCafe({...EstadoCafe, Materia: valor});
          }}
        />
      </View>

      <View style={{marginRight: '15%', marginLeft: '15%'}}>
        <TextInput
          multiline={true}
          numberOfLines={4}
          mode="outlined"
          selectionColor="#598A99"
          keyboardType="default"
          activeOutlineColor="#598A99"
          style={styles.inputCa}
          label="Observacion"
          value={Observacion}
          right={
            <TextInput.Icon
              style={styles.icon}
              type="material-community"
              name="file-eye-outline"
              size={30}
              color="black"
            />
          }
          onChangeText={valor => {
            setObservacion(valor);
          }}
        />
      </View>

      <Text
        style={{
          textAlign: 'center',
          marginTop: 15,
          fontWeight: 'bold',
          color: 'black',
        }}>
        Alturas
      </Text>
      <View
        style={{
          marginRight: '30%',
          marginLeft: '30%',
          borderStyle: 'solid',
          borderRadius: 15,
          borderWidth: 1,
        }}>
        <RNPickerSelect
          placeholder={{
            label: 'Altura',
            value: null,
          }}
          onValueChange={value => setAltura({...Altura, value: value})}
          items={[
            {label: 'STD', value: 'STD'},
            {label: 'SHG', value: 'SHG'},
            {label: 'HG', value: 'HG'},
            {label: 'Especiales', value: 'Especiales'},
          ]}
          value={Altura.value}
        />
      </View>

      <Text
        style={{
          textAlign: 'center',
          marginTop: 15,
          fontWeight: 'bold',
          color: 'black',
        }}>
        Precio Fijado
      </Text>
      <View
        style={{
          marginRight: '35%',
          marginLeft: '35%',
          borderStyle: 'solid',
          borderRadius: 15,
          borderWidth: 1,
        }}>
        <RNPickerSelect
          placeholder={{
            label: 'Precio Fijado',
            value: null,
          }}
          onValueChange={value =>
            setPrecioFijado({...PrecioFijado, value: value})
          }
          items={[
            {label: 'No', value: 'No'},
            {label: 'Si', value: 'Si'},
          ]}
          value={PrecioFijado.value}
        />
      </View>
    </ScrollView>
  );
}

function FinalGuardar({
  Beneficio,
  Marca,
  Cliente,
  Pesos,
  SumaLibras,
  Muestras,
  SumaSacos,
  PrecioFijado,
  Altura,
  EstadoCafe,
  Observacion,
  navigation,
  params,
  NMarca,
  Propie,
  Npropie,
  Correlati,
}) {
  const [Impresora, setImpresora] = useState(false);
  const [Array, setArray] = useState([]);
  const [Dialo, setDialo] = useState(false);
  const hideDialog = () => setDialo(false);
  const [Loading, setLoading] = useState(false);
  const {setRefreshConsulta} = useContext(refreshGlobal);
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
    let fecha = moment().format('DD/MM/YYYY');
    let Corre = Number(Correlati) + 1;

    let Array = [
      {
        cliente: JSON.stringify(Cliente),
        NombreCliente: Cliente.Nombre,
        Beneficio: Beneficio.id,
        Marca: Marca,
        NMarca: NMarca,
        Pesos: JSON.stringify(Pesos),
        Tipo: params.data,
        SumaLibras: SumaLibras,
        Muestras: Muestras,
        SumaSacos: SumaSacos,
        PrecioFijado: PrecioFijado.value,
        Altura: Altura.value,
        EstadoCafe: JSON.stringify(EstadoCafe),
        FechaCreacion: fecha,
        Estado: 1,
        Observacion: Observacion,
        Propie: Propie,
        Npropie: Npropie,
        Correlativo: String(Corre),
        Descuento: SumaDes.toFixed(2),
        Neto: Neto.total.toFixed(2),
      },
    ];

    setArray(Array[0]);
    // console.log(Array[0]);
  }, [Dialo]);


  const Guardar = async () => {
    let Corre = Number(Correlati) + 1;
    setDialo(false);
    setRefreshConsulta(true);
    setLoading(true);
    try {
      const db = await getDBConnection();
      await insertTablaNotas(db, Array);
      printText();
      setRefreshConsulta(false);

      AsyncStorage.setItem('Correlativo', String(Corre));
      // navigation.navigate('Pantalla1');

      setTimeout(() => {
        setVisibleBene(true);
        setLoading(false);
      }, 4000);
      setVisibleBene(false);
      console.log('se agregaron los datos en la tabla Notas');
      db.close;
    } catch (error) {
      console.log(error);
      setLoading(false);
      setRefreshConsulta(false);
      setVisibleBene(false);
    }
  };

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

    if (params.data === 'Pergamino') {
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
      `Nota de peso NO: ${Number(Correlati) + 1}\n\r`,
      {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
      },
    );

    await BluetoothEscposPrinter.printText(
      `Fecha: ${moment().format('DD/MM/YYYY')}\n\r`,
      {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
      },
    );

    await BluetoothEscposPrinter.printText(
      `ID Productor: ${Cliente.Identidad}\n\r`,
      {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
      },
    );

    await BluetoothEscposPrinter.printText(
      `Nombre Productor: ${Cliente.Nombre}\n\r`,
      {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
      },
    );

    await BluetoothEscposPrinter.printText(
      `Beneficio: ${Beneficio.Nombre}\n\r`,
      {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
      },
    );

    await BluetoothEscposPrinter.printText(`Marca: ${NMarca}\n\r`, {
      encoding: 'GBK',
      codepage: 0,
      widthtimes: 0,
      heigthtimes: 0,
    });

    await BluetoothEscposPrinter.printText(
      `Altura: ${Altura.value}    Estado: ${params.data}\n\r`,
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
      `Precio Fijado: ${PrecioFijado.value}\n\r`,
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
      Pesos.map(
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
      `Nota de peso NO: ${Number(Correlati) + 1}\n\r`,
      {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
      },
    );

    await BluetoothEscposPrinter.printText(
      `Fecha: ${moment().format('DD/MM/YYYY')}\n\r`,
      {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
      },
    );

    await BluetoothEscposPrinter.printText(
      `ID Productor: ${Cliente.Identidad}\n\r`,
      {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
      },
    );

    await BluetoothEscposPrinter.printText(
      `Nombre Productor: ${Cliente.Nombre}\n\r`,
      {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
      },
    );

    await BluetoothEscposPrinter.printText(
      `Beneficio: ${Beneficio.Nombre}\n\r`,
      {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
      },
    );

    await BluetoothEscposPrinter.printText(`Marca: ${NMarca}\n\r`, {
      encoding: 'GBK',
      codepage: 0,
      widthtimes: 0,
      heigthtimes: 0,
    });

    await BluetoothEscposPrinter.printText(
      `Altura: ${Altura.value}    Estado: ${params.data}\n\r`,
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
      `Precio Fijado: ${PrecioFijado.value}\n\r`,
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
      Pesos.map(
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
  };

  return (
    <>
      <LoadingLogin isVisible={Loading} text="Agregando Notas" />
      {/* <Text style={{textAlign: 'center'}}>Verificar Datos</Text> */}
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
          Verificar Datos
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
            Cliente: {Cliente.Nombre}
          </Text>
          <Text style={{fontWeight: 'bold', color: 'black'}}>
            Identidad: {Cliente.Identidad}
          </Text>
          <Text style={{fontWeight: 'bold', color: 'black'}}>
            Marca: {NMarca}
          </Text>

          {size(Npropie) > 0 ? (
            <Text style={{fontWeight: 'bold', color: 'black'}}>
              Propietario: {Npropie}
            </Text>
          ) : Number(Propie) === 1 ? (
            <Text style={{fontWeight: 'bold', color: 'black'}}>
              Propietario: COHORSIL
            </Text>
          ) : null}
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

        {/* <View style={{flexDirection: 'row', margin: 15}}>
          <View style={{width: '32%'}}>
            <Text
              style={{textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>
              Total Sacos: {SumaSacos}
            </Text>
          </View>

          <View style={{width: '32%'}}>
            <Text
              style={{textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>
              Total Libras: {SumaLibras}
            </Text>
          </View>

          <View style={{width: '36%'}}>
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
                Fruto verde: {EstadoCafe.Frutoverde}(Uds){'   '}
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

        {size(Observacion) > 0 ? (
          <View
            style={{
              marginRight: '5%',
              marginLeft: '5%',
              backgroundColor: '#96999C',
              height: 70,
              borderRadius: 10,
              padding: 3,
              marginBottom: 15,
              marginTop: 15,
            }}>
            <Text style={{fontWeight: 'bold', color: 'white', fontSize: 17}}>
              Observacion: {Observacion ? Observacion : '  Sin observacion'}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={{width: 350, marginLeft: 'auto', marginRight: 'auto'}}>
        <Button
          icon="content-save"
          color="#3F8C4D"
          mode="contained"
          onPress={() => setDialo(true)}>
          Guardar e Imprimir
        </Button>
      </View>

      <Portal>
        <Dialog visible={Dialo} onDismiss={hideDialog}>
          <Dialog.Content>
            <Paragraph style={{fontWeight: 'bold', fontSize: 20}}>
              Estas Seguro de la informacion?
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions style={{marginLeft: 'auto', marginRight: 'auto'}}>
            <Button
              icon="arrow-left"
              color="#AD5A42"
              mode="contained"
              onPress={() => hideDialog()}>
              Verificar
            </Button>
            <View style={{margin: 20}}></View>
            <Button
              icon="printer"
              color="#3F8C4D"
              mode="contained"
              onPress={() => Guardar()}>
              Guardar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <IconButton
        style={{position: 'absolute'}}
        icon="printer"
        size={35}
        onPress={() => setImpresora(true)}
      />

      <Portal>
        <Dialog visible={VisibleBene}>
          <Dialog.Content>
            <Paragraph style={{fontWeight: 'bold', fontSize: 18}}>
              Imprimir Comprobante de Beneficio?
            </Paragraph>

            <Button
              icon="printer"
              mode="contained"
              color="#42954B"
              onPress={() => {
                printText2();
                navigation.navigate('Pantalla1');
              }}>
              imprimir
            </Button>

            <View style={{marginTop: 15}}>
              <Button
                icon="exit-to-app"
                mode="contained"
                color="red"
                onPress={() => navigation.navigate('Pantalla1')}>
                Nueva Nota
              </Button>
            </View>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  Title: {
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
  },
  TXT: {
    color: 'black',
    fontWeight: 'bold',
  },
  profileContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    height: 170,
    marginTop: 15,
    marginBottom: 15,
  },
  textcontedata: {
    backgroundColor: '#F5F5F5',
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 15,
    marginBottom: 10,
    marginTop: 10,
  },
  contenedortitle: {
    flexDirection: 'row',
    display: 'flex',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  iconleft: {
    marginLeft: 10,
    marginRight: 5,
  },
  Contad: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  Contad2: {
    fontWeight: 'bold',
    fontSize: 15,
    color: 'black',
  },
  button: {
    borderRadius: 30,
    width: 200,
    marginTop: 10,
    backgroundColor: '#318EFF',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginBottom: 10,
  },
  signIn: {
    flexDirection: 'row',
    paddingBottom: 5,
    width: '90%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  icon: {
    paddingRight: 5,
  },
});
