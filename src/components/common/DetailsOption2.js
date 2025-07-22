import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {windowHeight, windowWidth} from '../../utils/Dimensions';

const DetailsOption2 = ({label, value}) => {
  return (
    <View style={styles.Q}>
      <Text style={styles.summaryQ}>{label}</Text>
      <Text numberOfLines={3} ellipsizeMode="tail" style={styles.summaryA}>
        {value || 'N/A'}
      </Text>
    </View>
  );
};

export default DetailsOption2;

const styles = StyleSheet.create({
  summaryQ: {
    color: '#333',
    // fontWeight: '500',
    fontSize: 14,
    // backgroundColor: 'blue',
  },
  summaryQ1: {
    color: '#ccc',
    // fontWeight: '500',
    fontSize: 14,
    // backgroundColor: 'red',
    width: windowWidth / 1.3,
  },
  summaryA: {
    color: '#000',
    fontWeight: '500',
    fontSize: 16,
    flexWrap: 'wrap',
    width: '100%',
    // backgroundColor: 'green',
  },
  summaryQ2: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  br: {
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  Q: {
    justifyContent: 'space-between',
    // alignContent: 'center',
    // alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    padding: 10,
    flexDirection: 'column',
    height: 'auto',
  },
  breaker: {
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  summary: {
    fontSize: 17,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 10,
    color: '#fff',
  },
});
