import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

const StartSleepScreen = ({ navigation }) => {
  const [sleepStarted, setSleepStarted] = useState(false);

  const handleStart = () => {
    setSleepStarted(true); // active le mode nuit (transition)
  };

  const handleStop = () => {
    navigation.navigate('SleepMain'); // revient à la page de stats
  };

  return (
    <Animatable.View
      animation={sleepStarted ? 'fadeIn' : undefined}
      duration={1500}
      style={[styles.container, sleepStarted && styles.nightMode]}
    >
      {!sleepStarted ? (
        <>
          <Animatable.Text
            animation="fadeInDown"
            duration={2000}
            style={styles.title}
          >
            Préparez-vous à dormir 😴
          </Animatable.Text>

          <Animatable.View animation="pulse" iterationCount="infinite" style={styles.pulseCircle} />

          <Button title="Démarrer le sommeil" onPress={handleStart} />
        </>
      ) : (
        <>
          <Text style={[styles.title, { color: '#fff' }]}>😴 Mode nuit activé</Text>
          <Button
            title="Arrêter"
            color="#66C266"
            onPress={() => {
                navigation.navigate('SleepMain'); // ou navigation.goBack()
            }}
            />
        </>
      )}
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001F3F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nightMode: {
    backgroundColor: '#000', // mode nuit
  },
  title: {
    color: 'white',
    fontSize: 24,
    marginBottom: 30,
  },
});

export default StartSleepScreen;
