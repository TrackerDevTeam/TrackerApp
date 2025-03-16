import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/common/Header';
import styles from './styles/SettingsScreen.styles';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Header title="Settings" />
      <View style={styles.content}>
        <Text>Les paramètres sont ici. </Text>
      </View>
    </View>
  );
};


export default HomeScreen;