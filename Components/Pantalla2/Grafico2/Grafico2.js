import {StyleSheet, Text, View, Dimensions} from 'react-native';
import React from 'react';
import {LineChart} from 'react-native-chart-kit';
import { size } from 'lodash';
const screenWidth = Dimensions.get('window').width;

export default function Grafico2({NombreCli, LibraT}) {


console.log(LibraT);

  // const data = {
  //   labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  //   datasets: [
  //     {
  //       data: [20, 45, 28, 80, 99, 43],
  //       color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
  //       strokeWidth: 2, // optional
  //     },
  //   ],
  //   legend: ['Rainy Days'], // optional
  // };

  // const chartConfig = {
  //   backgroundColor: '#e26a00',
  //   backgroundGradientFrom: '#fb8c00',
  //   backgroundGradientTo: '#ffa726',
  //   decimalPlaces: 2, // optional, defaults to 2dp
  //   color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  //   labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  //   style: {
  //     borderRadius: 16,
  //   },
  //   propsForDots: {
  //     r: '6',
  //     strokeWidth: '2',
  //     stroke: '#ffa726',
  //   },
  // };

  return (
    <>
      <View>
        <View
          style={{
            backgroundColor: '#CB5D50',
            width: 250,
            height: 40,
            borderTopLeftRadius: 15,
            borderBottomLeftRadius: 15,
            position: 'absolute',
            right: 0,
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Clientes con mas Libras
          </Text>
        </View>
      </View>

      <View style={{marginTop: 50, borderRadius: 25}}>


      {size(NombreCli && LibraT) > 0 ? 
        <LineChart
          data={{
            labels: NombreCli,
            datasets: [
              {
                data: LibraT,
              },
            ],
          }}
          width={Dimensions.get('window').width} // from react-native
          height={220}
          yAxisInterval={1} // optional, defaults to 1
          withVerticalLabels={true}
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#e26a00',
            backgroundGradientTo: '#e26a00',
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#43B465',
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
        : null }
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
