import {
  StyleSheet,
  Text,
  View,
  Alert,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React, {useState, useEffect} from 'react';
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
  Provider,
  Modal,
} from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import {size, map} from 'lodash';
import * as Animatable from 'react-native-animatable';
import {getDBConnection, getTablaMarcas} from '../../../Utils/db';
import uuid from 'react-native-uuid';
import ModalImpresora from '../../ModalImpresora/ModalImpresora';
import {
  BluetoothManager,
  BluetoothEscposPrinter,
  BluetoothTscPrinter,
} from 'tp-react-native-bluetooth-printer';

export default function BeneficioUva() {
  const [active, setActive] = useState(0);

  //State de Cliente
  const [Beneficio, setBeneficio] = useState([]);
  const [Marca, setMarca] = useState([]);
  const [Cliente, setCliente] = useState([]);

  //State de Pesos
  const [Pesos, setPesos] = useState([]);
  const [Tipo, setTipo] = useState({
    label: 'Uva',
    value: 'Uva',
  });
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
  });
  const [Observacion, setObservacion] = useState([]);

  const MyComponent = props => {
    return (
      <View>
        <Text>{props.title}</Text>
      </View>
    );
  };
  const content = [
    <DatosCliente
      setBeneficio={setBeneficio}
      Benefic={Beneficio}
      setMarca={setMarca}
      Marca={Marca}
      setCliente={setCliente}
      Cliente={Cliente}
    />,
    <AgregarPesos
      setPesos={setPesos}
      Pesos={Pesos}
      Tipo={Tipo}
      setTipo={setTipo}
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
    />,
    <FinalGuardar
      Beneficio={Beneficio}
      Marca={Marca}
      Cliente={Cliente}
      Pesos={Pesos}
      Tipo={Tipo}
      SumaLibras={SumaLibras}
      Muestras={Muestras}
      SumaSacos={SumaSacos}
      PrecioFijado={PrecioFijado}
      Altura={Altura}
      EstadoCafe={EstadoCafe}
    />,
  ];

  const Nextclientes = () => {
    if (active === 0) {
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
          onFinish={() => Alert.alert('Finish')}
          // showButton={false}
        ></Stepper>
      </ScrollView>
      {/* {active === 0 ? null : (
        <View style={{position: 'absolute', bottom: '5%', left: '25%'}}>
          <Button
            icon="arrow-left"
            // mode="contained"
            style={{backgroundColor: '#E15757'}}
            color="white"
            onPress={() => setActive(p => p - 1)}>
            Regresar
          </Button>
        </View>
      )} */}

      {/* <View
        style={
          active === 0
            ? {
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: '5%',
                alignItems: 'center',
              }
            : {position: 'absolute', bottom: '5%', right: '25%'}
        }>
        <Button
          icon="arrow-right"
          mode="contained"
          color="#488F59"
          contentStyle={{flexDirection: 'row-reverse'}}
          onPress={() => Nextclientes()}>
          Siguiente
        </Button>
      </View> */}
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
}) {
  const [searchi, setSearchi] = useState('');
  const [Searcresul, setSearcresul] = useState([]);
  const [Marcasdata, setMarcasdata] = useState([]);

  useEffect(() => {
    ObtenerDatosMarcas();
    ClientesPre();
  }, []);

  const ObtenerDatosMarcas = async () => {
    try {
      const db = await getDBConnection();
      const taskdatabase = await getTablaMarcas(db);
      setMarcasdata(taskdatabase);
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
      console.log(task);
      console.log(task.length);
      setSearcresul(task);
      // return task;
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

  const pickerStyle = {
    inputIOS: {
      color: 'black',
      paddingTop: 13,
      paddingHorizontal: 10,
      paddingBottom: 12,
      textAlign: 'center',
      fontSize: 40,
      fontWeight: 'bold',
    },
    inputAndroid: {
      color: 'black',
      textAlign: 'center',
      fontSize: 40,
      fontWeight: 'bold',
    },
    placeholderColor: 'black',
    underline: {borderTopWidth: 3},
    icon: {
      position: 'absolute',
      backgroundColor: 'transparent',
      borderTopWidth: 5,
      borderTopColor: 'black',
      borderRightWidth: 5,
      borderRightColor: 'transparent',
      borderLeftWidth: 5,
      borderLeftColor: 'transparent',
      width: 0,
      height: 0,
      top: 20,
      right: 15,
    },
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
          <Text style={styles.Title}>No. Factura :</Text>
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
                label: 'Seleccione un Beneficio',
                value: null,
              }}
              onValueChange={value => setBeneficio(value)}
              items={Marcasdata}
              value={Benefic ? Benefic : null}
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
              onValueChange={value => setMarca(value)}
              items={Marcasdata}
              value={Marca ? Marca : null}
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
                      textAlign: 'right',
                      fontWeight: 'bold',
                      color: '#878581',
                      fontSize: 13,
                    }}>
                    {/* #{item.Codigo.trim()} */}
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
  Tipo,
  setTipo,
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

      <View
        style={{
          marginRight: '30%',
          marginLeft: '30%',
          borderStyle: 'solid',
          borderRadius: 15,
          borderWidth: 1,
          marginTop: 15,
        }}>
        <RNPickerSelect
          onValueChange={value =>
            setTipo({...Tipo, label: value, value: value})
          }
          items={[
            {label: 'Uva', value: 'Uva'},
            {label: 'Pergamino', value: 'Pergamino'},
          ]}
          value={Tipo.value}
        />
      </View>

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
}) {
  return (
    <ScrollView>
      <Text style={{textAlign: 'center'}}> Estado</Text>

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

      <View style={{marginRight: '23%', marginLeft: '23%'}}>
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
  Tipo,
  SumaLibras,
  Muestras,
  SumaSacos,
  PrecioFijado,
  Altura,
  EstadoCafe,
}) {
  const [Impresora, setImpresora] = useState(false);
  useEffect(() => {
    let Array = [
      {
        cliente: JSON.stringify(Cliente),
        Beneficio: Beneficio,
        Marca: Marca,
        Pesos: JSON.stringify(Pesos),
        Tipo: Tipo.value,
        SumaLibras: SumaLibras,
        Muestras: Muestras,
        SumaSacos: SumaSacos,
        PrecioFijado: PrecioFijado.value,
        Altura: Altura.value,
        EstadoCafe: JSON.stringify(EstadoCafe),
      },
    ];

    // console.log(Array);
  }, []);

  console.log(Cliente);

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
    await BluetoothEscposPrinter.printText('siguatepeque, Honduras\n\r', {
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

    await BluetoothEscposPrinter.printText(
      `Fecha: ${moment().format('L')}\n\r`,
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
      `Nombre Productor: ${Cliente.Identidad}\n\r`,
      {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
      },
    );

    await BluetoothEscposPrinter.printText(
      `Beneficio: CICAM\n\r`,
      {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
      },
    );

    await BluetoothEscposPrinter.printText(
      `Marca: Cerro Azul\n\r`,
      {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
      },
    );


    await BluetoothEscposPrinter.printText(
      `Altura: ${Altura.value}    Estado: ${Tipo.value}\n\r`,
      {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
      },
    );
    await BluetoothEscposPrinter.printText(
      `Peso en: Libras\n\r`,
      {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
      },
    );

    await BluetoothEscposPrinter.printText(
      '------------Descuentos----------\n\r',
      {},
    );

  };

  return (
    <>
      <Text style={{textAlign: 'center'}}>Verificar Datos</Text>
      <ModalImpresora Impresora={Impresora} setImpresora={setImpresora} />

      <View>
        <IconButton
          icon="printer"
          size={25}
          onPress={() => setImpresora(true)}
        />

        <Text>Cliente: {Cliente.Nombre}</Text>
        <Text>Identidad: {Cliente.Identidad}</Text>
        <Text>Marca: {Marca}</Text>

        <Button onPress={() => printText()}>Imprimir</Button>
      </View>
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
