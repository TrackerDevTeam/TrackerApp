import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/common/Header';
import styles from './styles/ProfileScreen.styles';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Header title="Profil" />
      <View style={styles.content}>
        <Text>Les informations sur votre profil sont disponibles ici.</Text>
      </View>
    </View>
  );
};


export default HomeScreen;