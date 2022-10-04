import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { FAB, Portal, Provider } from 'react-native-paper';

export default function Pantalla1({navigation}) {



  //Buttom grup
  const [state, setState] = React.useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;




  return (
    <>
      <Text style={{textAlign: "center", color: "black"}}>Home</Text>
      <Provider>
      <Portal>
        <FAB.Group
          open={open}
          icon={open ? 'backburger' : 'plus'}
          actions={[
            { icon: 'arrow-right-circle-outline', onPress: () => console.log('Pressed add') },
            {
              icon: 'account-plus',
              label: 'Agregar Cliente',
              onPress: () => console.log('Pressed star'),
            },
            {
              icon: 'sprout-outline',
              label: 'Café Pergamino',
              onPress: () => console.log('Pressed email'),
            },
            {
              icon: 'spa-outline',
              label: 'Café Uva',
              onPress: () => navigation.navigate("BeneficioUva"),
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
  )
}

const styles = StyleSheet.create({})