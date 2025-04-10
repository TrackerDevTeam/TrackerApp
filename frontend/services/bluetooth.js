import React from 'react';
import { View, Text } from 'react-native';

const BluetoothStatus = ({ isConnected }) => {
  return (
    <View>
      <Text>Bluetooth : {isConnected ? 'Connecté' : 'Déconnecté'}</Text>
    </View>
  );
};

export default BluetoothStatus;