import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/common/Header';
import styles from './styles/WorkoutScreen.styles';

const WorkoutScreen = () => {
  return (
    <View style={styles.container}>
      <Header title="Workout" />
      <View style={styles.content}>
        <Text>Vos entraînements sont répertoriés ici.</Text>
      </View>
    </View>
  );
};

export default WorkoutScreen;