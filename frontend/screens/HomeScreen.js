import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/common/Header';
import styles from './styles/HomeScreen.styles';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Header title="Accueil" />
      <View style={styles.content}>
        <Text>Bienvenue dans Tracker notre projet de M2</Text>
      </View>
    </View>
  );
};


export default HomeScreen;