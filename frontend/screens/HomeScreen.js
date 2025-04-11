import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/common/Header';
import { Calendar } from 'react-native-calendars';
import styles from './styles/HomeScreen.styles';

const formatDate = (dateString) => {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

const HomeScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const today = new Date().toISOString().split('T')[0];

  // Données statiques pour l'exemple (vous pouvez les remplacer par des données dynamiques)
  const user = "user123";
  const sleepData = '7'; // Exemple pour Sommeil
  const nutritionData = '1635'; // Exemple pour Nutrition
  const heartRateData = '65'; // Exemple pour Fréquence cardiaque

  return (
    <View style={styles.container}>
      <Header title="Accueil" />
      <View>
        <Text style={styles.userTitle}>Bienvenue, {user} !</Text>

        <Calendar
          style={{
            borderWidth: 1,
            borderColor: 'gray',
            marginTop: 10,
          }}
          markedDates={{
            [today]: { selected: true, marked: true, selectedColor: 'orange' },
            [selectedDate]: { selected: true, marked: true, selectedColor: 'blue' },
          }}
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
          }}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#00adf5',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#00adf5',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
          }}
        />

        <Text style={styles.textResumeDay}>Résumé de la journée</Text>
        <Text style={styles.dateSelected}>{formatDate(selectedDate)}</Text>

        {/* Section des cercles pour Sommeil, Nutrition, Fréquence cardiaque */}
        <View style={localStyles.metricsContainer}>
          {/* Sommeil */}
          <View style={localStyles.metricItem}>
            <View style={[localStyles.circle, { borderColor: '#00C4B4' }]}>
              <Text style={localStyles.circleText}>{sleepData}h</Text>
            </View>
            <Text style={localStyles.label}>Sommeil</Text>
          </View>

          {/* Nutrition */}
          <View style={localStyles.metricItem}>
            <View style={[localStyles.circle, { borderColor: '#FF7F50' }]}>
              <Text style={localStyles.circleText}>{nutritionData} Kcal</Text>
            </View>
            <Text style={localStyles.label}>Nutrition</Text>
          </View>

          {/* Fréquence cardiaque */}
          <View style={localStyles.metricItem}>
            <View style={[localStyles.circle, { borderColor: '#6495ED' }]}>
              <Text style={localStyles.circleText}>{heartRateData} bpm</Text>
            </View>
            <Text style={localStyles.label}>FC</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// Styles locaux pour les cercles
const localStyles = StyleSheet.create({
  metricsContainer: {
    flexDirection: 'row', // Aligner les éléments horizontalement
    justifyContent: 'space-around', // Espacer les éléments uniformément
    marginTop: 20,
    marginHorizontal: 10,
  },
  metricItem: {
    alignItems: 'center', // Centrer les éléments verticalement
  },
  circle: {
    width: 80, // Largeur du cercle
    height: 80, // Hauteur du cercle
    borderRadius: 40, // Pour rendre le cercle rond (moitié de la largeur/hauteur)
    borderWidth: 2, // Bordure du cercle
    justifyContent: 'center', // Centrer le texte à l'intérieur
    alignItems: 'center',
    backgroundColor: '#F5F5F5', // Fond gris clair comme dans la capture
  },
  circleText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  label: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default HomeScreen;