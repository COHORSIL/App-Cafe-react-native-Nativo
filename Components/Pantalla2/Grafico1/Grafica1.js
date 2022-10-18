import {StyleSheet, Text, View, Dimensions} from 'react-native';
import React, {useState, useEffect} from 'react';

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';

import {size} from 'lodash';

const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#08130D',
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
};

export default function Grafica1({Labels}) {
  return (
    <View>
      <View style={{backgroundColor: '#CB5D50', width: 250, height: 40, borderTopRightRadius: 15, borderBottomRightRadius: 15}}>
        <Text style={{color: "white", fontSize: 18, fontWeight: "bold"}}>Clientes con mas Sacos</Text>
      </View>
      {size(Labels) > 0 ? (
        <PieChart
          style={styles.pastel}
          data={Labels}
          height={220}
          width={Dimensions.get('window').width}
          chartConfig={chartConfig}
          accessor={'population'}
          backgroundColor={'transparent'}
          paddingLeft={'5'}
          center={[5, 20]}
          absolute
        />
      ) : (
        <Text>Grafico Cargando</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
