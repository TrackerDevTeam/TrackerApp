import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView } from 'react-native'; // 👈 ajout de ScrollView
import Header from '../components/common/Header';
import { Calendar } from 'react-native-calendars';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { UserContext } from '../../UserContext';
import styles from './styles/HomeScreen.styles';

const HomeScreen = () => {
  const {userId} = useContext(UserContext);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const [nutritionData, setNutritionData] = useState('0');
  const [sleepData, setSleepData] = useState('0');
  const [trainingData, setTrainingData] = useState('0');
  const [insight, setInsight] = useState(
      "Pour améliorer vos performances, vous devriez augmenter vos minutes de sommeil de 84.00, ajuster votre nutrition en augmentant vos calories de 560.00 calories (ce qui correspond à une augmentation de 30.00g de protéines, 70.00g de glucides et 16.00g de lipides)."
  );

  const convertDateToFirebaseFormat = (dateStr) => dateStr.replace(/-/g, '_');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userId || !selectedDate) {
          console.log('userId ou selectedDate manquant');
          return;
        }
        const firebaseDate = convertDateToFirebaseFormat(selectedDate);
        console.log('Date Firebase :', firebaseDate);

        // Nutrition
        const nutritionRef = doc(db, `users/${userId}/${firebaseDate}`, 'nutrition');
        const nutritionSnap = await getDoc(nutritionRef);
        if (nutritionSnap.exists()) {
          const data = nutritionSnap.data();
          setNutritionData(data.calories ? data.calories.toString() : '0');
        } else {
          console.log('Aucune donnée nutrition trouvée pour cette date');
          setNutritionData('0');
        }

        // Sommeil (structure imbriquée dans data.sommeil)
        const sleepRef = doc(db, `users/${userId}/${firebaseDate}`, 'sommeil');
        const sleepSnap = await getDoc(sleepRef);
        if (sleepSnap.exists()) {
          const data = sleepSnap.data();
          console.log('Données du sommeil récupérées :', data);
          const sleepValue = data.sommeil && data.sommeil.total_heure ? data.sommeil.total_heure : '0';
          setSleepData(sleepValue.toString());
        } else {
          console.log('Aucune donnée sommeil trouvée pour cette date');
          setSleepData('0');
        }

        // Training
        const trainingRef = doc(db, `users/${userId}/${firebaseDate}`, 'training');
        const trainingSnap = await getDoc(trainingRef);
        if (trainingSnap.exists()) {
          const data = trainingSnap.data();
          setTrainingData(data.tonnage_total ? data.tonnage_total.toString() : '0');
        } else {
          console.log('Aucune donnée training trouvée pour cette date');
          setTrainingData('0');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        setNutritionData('0');
        setSleepData('0');
        setTrainingData('0');
      }
    };

    fetchUserData();
  }, [userId, selectedDate]);

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        // Remplacez l'URL par celle de votre backend (attention en environnement mobile)
        const response = await fetch("http://172.20.10.2:5000/insight");
        if (response.ok) {
          const data = await response.json();
          setInsight(data.insight);
        } else {
          console.log("Erreur lors du chargement de l'insight");
          setInsight("Erreur lors du chargement de l'insight");
        }
      } catch (error) {
        console.error("Erreur lors du fetch de l'insight :", error);
        setInsight("Erreur lors du chargement de l'insight");
      }
    };

    fetchInsight();
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const markedDates = {
    [today]: {selected: true, marked: true, selectedColor: 'orange'},
    [selectedDate]: {selected: true, marked: true, selectedColor: 'blue'},
  };

  return (
      <ScrollView
          style={{
            flex: 1,
            backgroundColor: '#fff',
            padding: 20,
            // Remove justifyContent from here
          }}
          contentContainerStyle={{
            paddingBottom: 40,
            justifyContent: 'center', // Move it here instead
          }}
      >
        <View>
          <Text style={styles.userTitle}>Bienvenue, {userId} !</Text>

          <Calendar
              style={{
                borderWidth: 1,
                borderColor: 'gray',
                marginTop: 10,
              }}
              markedDates={markedDates}
              onDayPress={(day) => setSelectedDate(day.dateString)}
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
            {selectedDate.replace(/-/g, '/')}
          </Text>

          <View style={styles.metricsContainer}>
            <View style={styles.metricItem}>
              <View style={styles.circle}>
                <Text style={styles.circleText}>{nutritionData}</Text>
              </View>
              <Text style={styles.label}>Calories</Text>
            </View>

            <View style={styles.metricItem}>
              <View style={styles.circle}>
                <Text style={styles.circleText}>{sleepData}</Text>
              </View>
              <Text style={styles.label}>Sommeil</Text>
            </View>

            <View style={styles.metricItem}>
              <View style={styles.circle}>
                <Text style={styles.circleText}>{trainingData}</Text>
              </View>
              <Text style={styles.label}>Tonnage</Text>
            </View>
          </View>

          <View style={styles.insightContainer}>
            <Text style={styles.insightTitle}>Insight du jour :</Text>
            <Text style={styles.insightText}>{insight}</Text>
          </View>
        </View>
      </ScrollView>
  );
};

  export default HomeScreen;
