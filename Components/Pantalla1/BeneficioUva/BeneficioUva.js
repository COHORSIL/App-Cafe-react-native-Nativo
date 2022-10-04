import {
  StyleSheet,
  Text,
  View,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Stepper from 'react-native-stepper-ui';
import moment from 'moment/moment';
import {Icon, SearchBar} from 'react-native-elements';
import ActionSheet, {SheetManager} from 'react-native-actions-sheet';
import {Button} from 'react-native-paper';
import {Beneficio, ClienteCafe} from '../../../Utils/Api';
import Usuario from '../../../Hooks/Usuario';
import RNPickerSelect from 'react-native-picker-select';
import {size} from 'lodash';
import * as Animatable from 'react-native-animatable';

export default function BeneficioUva() {
  const [active, setActive] = useState(0);
  const [Beneficio, setBeneficio] = useState([]);
  const [Marca, setMarca] = useState([]);
  const [Cliente, setCliente] = useState([]);

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
    <MyComponent title="Component 2" />,
    <MyComponent title="Component 3" />,
  ];
  return (
    <View style={{marginVertical: 80, marginHorizontal: 20}}>
      <Stepper
        active={active}
        content={content}
        onNext={() => setActive(p => p + 1)}
        onBack={() => setActive(p => p - 1)}
        onFinish={() => Alert.alert('Finish')}
      />
    </View>
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
  const {token} = Usuario();
  const [Datbene, setDatbene] = useState([]);
  const [searchi, setSearchi] = useState('');
  const [Searcresul, setSearcresul] = useState([]);

  console.log(Cliente);

  useEffect(() => {
    const listInfo2 = [];
    let url = Beneficio();
    let options1 = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    };

    fetch(url, options1)
      .then(res => res.json())
      .then(result => {
        result.Beneficios.forEach(function (item, index) {
          listInfo2.push({
            label: item.Nombre,
            value: item.id,
          });
        });

        setDatbene(listInfo2);
      })
      .catch(error => {
        console.log(error);
      });
  }, [token]);

  useEffect(() => {
    let url = ClienteCafe();
    let options1 = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    };

    fetch(`${url}&search=${searchi}`, options1)
      .then(res => res.json())
      .then(result => {
        setSearcresul(result.Clientes);
      })
      .catch(error => {
        console.log(error);
      });
  }, [searchi]);

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
        <Text style={styles.Title}>Datos</Text>
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

        {size(Datbene) > 0 ? (
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
              items={Datbene}
              value={Benefic ? Benefic : null}
            />
          </View>
        ) : null}
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

        {size(Datbene) > 0 ? (
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
              items={Datbene}
              value={Marca ? Marca : null}
            />
          </View>
        ) : null}
      </View>

      {size(Cliente) > 0 ? (
        <Animatable.View
          animation="fadeInUpBig"
          style={styles.profileContainer}>
          <View style={styles.textcontedata}>
            <View style={styles.contenedortitle}>
              <View style={styles.iconleft}>
                <Icon
                  type="material-community"
                  name="account-box"
                  size={22}
                  color="#00a680"
                />
              </View>
              <Text style={styles.Contad2}>{Cliente.Nombre.trim()}</Text>
            </View>

            <View style={styles.contenedortitle}>
              <View style={styles.iconleft}>
                <Icon
                  type="material-community"
                  name="card-bulleted"
                  size={22}
                  color="#00a680"
                />
              </View>
              <Text style={styles.Contad2}>{Cliente.Identidad.trim()}</Text>
            </View>

            <View style={styles.contenedortitle}>
              <View style={styles.iconleft}>
                <Icon
                  type="material-community"
                  name="card-bulleted"
                  size={22}
                  color="#00a680"
                />
              </View>
              <Text style={styles.Contad2}>{Cliente.Identidad.trim()}</Text>
            </View>


            <View
              style={{
                flexDirection: 'row',
                marginRight: 'auto',
                marginLeft: 'auto',
              }}>
              <Button
                icon="delete"
                onPress={() => 
                  setCliente([])
              
                }
                color="red">
                Eliminar
              </Button>

              {/* <Button
                icon="details"
                // onPress={() =>
                //   size(InfoCliente) > 0
                //     ? setModal(true)
                //     : ToastAndroid.show(`El Cliente no tiene Detalles`, 3000)
                // }
                color="#40B89B">
                Detalles
              </Button> */}
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
          onChangeText={e => setSearchi(e)}
          value={searchi}
          containerStyle={styles.searchBar}
        />

        <ScrollView>
          {size(Searcresul) > 0 ? (
            <>
              {Searcresul.map((item, index) => (
                <TouchableOpacity onPress={() => {setCliente(item);     SheetManager.hide('helloworld_sheet');} }>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: '#878581',
                      fontSize: 13,
                    }}>
                    #{item.Codigo.trim()}
                  </Text>
                  <View
                    style={{
                      backgroundColor: 'white',
                      borderBottomWidth: 1,
                      borderColor: '#eeeeee',
                      flexDirection: 'row',
                      height: 60,
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: '#878581',
                      }}>
                      {item.Nombre.trim().toUpperCase()}
                    </Text>
                  </View>

                  <View style={{position: 'absolute', bottom: 0, right: 30}}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: '#878581',
                      }}>
                      {item.Direccion ? item.Direccion.trim() : null}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          ) : null}

          
        </ScrollView>
        <Button
        style={{position: "absolute", left: "35%", bottom: 10, backgroundColor: "red"}}
                icon="close"
                onPress={() => 


                 { 
                  setCliente([]);
                  SheetManager.hide('helloworld_sheet')}
              
                }
                color="white">
                Cerrar
              </Button>
      </ActionSheet>
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
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    height: 110,
  },
  textcontedata: {
    backgroundColor: "#F5F5F5",
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 15,
    marginBottom: 10,
    marginTop: 10,
  },
  contenedortitle: {
    flexDirection: "row",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  iconleft: {
    marginLeft: 10,
    marginRight: 5,
  },
  Contad: {
    fontWeight: "bold",
    fontSize: 18,
  },
  Contad2: {
    fontWeight: "bold",
    fontSize: 15,
    color: "black"
  },
});
