import React, {useState, useContext} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  ToastAndroid,
} from 'react-native';
import {Icon} from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import {TextInput} from 'react-native-paper';
import {RadioButton} from 'react-native-paper';
import {getDBConnection} from '../../../Utils/db';
import {refreshGlobal} from '../../../Context/Context';
import LoadingLogin from '../../Loading/LoadingLogin';

export default function AddCliente({navigation}) {
  const [Nombre, setNombre] = useState([]);
  const [Direccion, setDireccion] = useState([]);
  const [Telefono, setTelefono] = useState([]);
  const [Identidad, setIdentidad] = useState([]);
  const [Ubicacion_Finca, setUbicacion_Finca] = useState([]);
  const [checked, setChecked] = useState('Masculino');
  const [isVisible, setIsVisible] = useState(false);
  const {setRefreshConsulta} = useContext(refreshGlobal);

  const submiPost = async () => {
    if (Nombre == '') {
      ToastAndroid.show('Ingrese Nombre!', 3000);
      return;
    }

    if (Identidad == '') {
      ToastAndroid.show('Ingrese Identidad!', 3000);
      return;
    }

    if (Telefono == '') {
      ToastAndroid.show('Ingrese Telefono!', 3000);
      return;
    }

    if (Direccion == '') {
      ToastAndroid.show('Ingrese Direccion!', 3000);
      return;
    }

    if (Ubicacion_Finca == '') {
      ToastAndroid.show('Ingrese Ubicacion de la Finca!', 3000);
      return;
    }

    setRefreshConsulta(true);
    setIsVisible(true);

    try {
      const db = await getDBConnection();
      const insertQuery =
        'INSERT INTO Clientes (Codigo, Nombre, Identidad, direccion, telefono, ubicacionFinca, genero, estado)  values (?,?,?,?,?,?,?,?)';
      await db.executeSql(insertQuery, [
        Identidad,
        Nombre,
        Identidad,
        Direccion,
        Telefono,
        Ubicacion_Finca,
        checked,
        1,
      ]);
      ToastAndroid.show('se agrego el Cliente Correctamente', 3000);
      navigation.navigate('Pantalla1');
      setRefreshConsulta(false);
      setIsVisible(false);
      db.close;
    } catch (error) {
      ToastAndroid.show(error, 3000);
      console.log(error);
    }
  };

  return (
    <>
      <LoadingLogin isVisible={isVisible} text="Agregando Cliente" />
      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        <TextInput
          style={styles.inputCa}
          label="Nombre "
          value={Nombre}
          keyboardType="default"
          right={
            <TextInput.Icon
              style={styles.icon}
              type="material-community"
              name="account"
              size={30}
              color="black"
            />
          }
          onChangeText={valor => {
            setNombre(valor);
          }}
        />

        <TextInput
          style={styles.inputCa}
          label="Identidad "
          value={Identidad}
          keyboardType="numeric"
          right={
            <TextInput.Icon
              style={styles.icon}
              type="material-community"
              name="badge-account-horizontal"
              size={30}
              color="black"
            />
          }
          onChangeText={valor => {
            setIdentidad(valor);
          }}
        />

        <TextInput
          style={styles.inputCa}
          label="Telefono "
          value={Telefono}
          keyboardType="numeric"
          right={
            <TextInput.Icon
              style={styles.icon}
              type="material-community"
              name="cellphone"
              size={30}
              color="black"
            />
          }
          onChangeText={valor => {
            setTelefono(valor);
          }}
        />

        <TextInput
          multiline={true}
          numberOfLines={2}
          //   placeholder="Ejem. 1 Mz. Pepino, 1Mz guayaba, 1/2 Mz Chile"
          style={styles.inputCa}
          label="Direccion"
          value={Direccion}
          right={
            <TextInput.Icon
              style={styles.icon}
              type="material-community"
              name="reflect-horizontal"
              size={30}
              color="black"
            />
          }
          onChangeText={valor => {
            setDireccion(valor);
          }}
        />

        <TextInput
          multiline={true}
          numberOfLines={2}
          style={styles.inputCa}
          label="Ubicacion Finca"
          value={Ubicacion_Finca}
          right={
            <TextInput.Icon
              style={styles.icon}
              type="material-community"
              name="reflect-horizontal"
              size={30}
              color="black"
            />
          }
          onChangeText={valor => {
            setUbicacion_Finca(valor);
          }}
        />

        <View style={{flexDirection: 'row', marginTop: 18, marginBottom: 18}}>
          <View style={{width: '50%'}}>
            <View
              style={{
                flexDirection: 'row',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}>
              <Text>Masculino</Text>
              <RadioButton
                value="Masculino"
                status={checked === 'Masculino' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('Masculino')}
              />
            </View>
          </View>

          <View style={{width: '50%'}}>
            <View
              style={{
                flexDirection: 'row',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}>
              <Text>Femenino</Text>
              <RadioButton
                value="Femenino"
                status={checked === 'Femenino' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('Femenino')}
              />
            </View>
          </View>
        </View>

        <View style={styles.button}>
          <TouchableOpacity
            colors={['#6FA3B9', '#6FA3B9']}
            style={styles.signIn}
            onPress={submiPost}>
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
      </Animatable.View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  foto: {
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: 30,
  },
  inputCa: {
    marginTop: 10,
    backgroundColor: 'white',
  },
  footer: {
    // flex: Platform.OS === "ios" ? 3 : 5,
    //   backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 1,
    borderWidth: 1,
    borderColor: '#C8C8C8',
    marginTop: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingBottom: 20,
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
