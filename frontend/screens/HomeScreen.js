import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/common/Header';
import { Calendar } from 'react-native-calendars';
import styles from './styles/HomeScreen.styles';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Adjust the path to your firebaseConfig
import { UserContext } from '../../UserContext';

const formatDate = (dateString) => {
  const [year, month, day] = dateString.split('-');
  return `${day}-${month}-${year}`; // Returns DD-MM-YYYY for Firebase
};

const HomeScreen = () => {
  const { userId, date } = useContext(UserContext); // Get userId and date from context
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [nutritionData, setNutritionData] = useState('0'); // State for nutrition data
  const [sleepData, setSleepData] = useState('0'); // State for sleep data
  const [heartRateData, setHeartRateData] = useState('0'); // State for heart rate data
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Use selectedDate for fetching data, fallback to context date if needed
        const dateToFetch = selectedDate || date;
        if (!userId || !dateToFetch) {
          console.log('userId or date is missing');
          return;
        }

        // Format date to DD-MM-YYYY
        const formattedDate = formatDate(dateToFetch);
        console.log('Formatted Date for Firebase:', formattedDate);

        // Fetch Nutrition Data
        const nutritionRef = doc(db, `users/${userId}/${formattedDate}`, 'nutrition');
        const nutritionSnap = await getDoc(nutritionRef);
        if (nutritionSnap.exists()) {
          const firebaseData = nutritionSnap.data();
          setNutritionData(firebaseData.calorie ? firebaseData.calorie.toString() : '0');
        } else {
          console.log('No nutrition data found for this date');
          setNutritionData('0');
        }

        // Fetch Sleep Data
        const sleepRef = doc(db, `users/${userId}/${formattedDate}`, 'sommeil');
        const sleepSnap = await getDoc(sleepRef);
        if (sleepSnap.exists()) {
          const firebaseData = sleepSnap.data();
          setSleepData(firebaseData.duration ? firebaseData.duration.toString() : '0');
        } else {
          console.log('No sleep data found for this date');
          setSleepData('0');
        }

        // Fetch Heart Rate Data
        const heartRateRef = doc(db, `users/${userId}/${formattedDate}`, 'sante');
        const heartRateSnap = await getDoc(heartRateRef);
        if (heartRateSnap.exists()) {
          const firebaseData = heartRateSnap.data();
          setHeartRateData(firebaseData.bpm ? firebaseData.bpm.toString() : '0');
        } else {
          console.log('No heart rate data found for this date');
          setHeartRateData('0');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setNutritionData('0');
        setSleepData('0');
        setHeartRateData('0');
      }
    };

    fetchUserData();
  }, [userId, selectedDate, date]); // Re-fetch when userId or selectedDate changes

  return (
    <View style={styles.container}>
      <Header title="Accueil" />
      <View>
        <Text style={styles.userTitle}>Bienvenue, {userId} !</Text>

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
        <Text style={styles.dateSelected}>
          {formatDate(selectedDate)} {/* Display as DD/MM/YYYY */}
        </Text>

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
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginHorizontal: 10,
  },
  metricItem: {
    alignItems: 'center',
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
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