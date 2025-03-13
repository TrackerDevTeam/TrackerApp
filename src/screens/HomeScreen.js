import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/common/Header';

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

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default HomeScreen;