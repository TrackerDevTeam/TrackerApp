// NutritionScreen.js
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Alert, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { UserContext } from '../../UserContext';
import Header from '../components/common/Header';
import styles from './styles/NutritionScreen.styles';
import axios from 'axios';
import { foodDatabase } from '../../backend/foodDatabase';

const LOCAL_NUTRITION_KEY = 'localNutritionData';
const API_KEY = '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';
const LAST_SAVED_DATE_KEY = 'lastSavedNutritionDate';

const NutritionScreen = () => {
  const { userId, date } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [nutritionData, setNutritionData] = useState({
    calorie: 0,
    glucide: 0,
    lipide: 0,
    proteine: 0,
  });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Charger les données au démarrage
  useEffect(() => {
    loadNutritionData();
  }, [date]); // React to date changes

  // Gérer les suggestions en fonction de la saisie
  useEffect(() => {
    if (foodName.trim().length > 1) {
      const filteredSuggestions = foodDatabase
          .filter(food => food.name.toLowerCase().includes(foodName.toLowerCase()))
          .slice(0, 5); // Limiter à 5 suggestions
      setSuggestions(filteredSuggestions);
      setShowSuggestions(filteredSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [foodName]);

  // Charger les données locales et synchroniser avec Firebase
  const loadNutritionData = async () => {
    try {
      // Get the last saved date from AsyncStorage
      const lastSavedDate = await AsyncStorage.getItem(LAST_SAVED_DATE_KEY);

      // If the last saved date is different from the current context date, reset data
      if (lastSavedDate !== date) {
        console.log('New day detected, resetting nutrition data');
        // Reset nutrition data to zeros
        const resetData = {
          calorie: 0,
          glucide: 0,
          lipide: 0,
          proteine: 0,
        };

        // Update the state and local storage with reset data
        setNutritionData(resetData);
        await saveNutritionLocally(resetData);

        // Update the last saved date
        await AsyncStorage.setItem(LAST_SAVED_DATE_KEY, date);

        // Try to load from Firebase if data exists for the new date
        const nutritionRef = doc(db, `users/${userId}/${date}`, 'nutrition');
        const nutritionSnap = await getDoc(nutritionRef);

        if (nutritionSnap.exists()) {
          const firebaseData = nutritionSnap.data();
          console.log('Données chargées depuis Firebase pour nouvelle date:', firebaseData);
          const parsedData = {
            calorie: parseFloat(firebaseData.calorie) || 0,
            glucide: parseFloat(firebaseData.glucide) || 0,
            lipide: parseFloat(firebaseData.lipide) || 0,
            proteine: parseFloat(firebaseData.proteine) || 0,
          };
          setNutritionData(parsedData);
          await saveNutritionLocally(parsedData);
        }

        return; // Exit function since we've handled the data
      }

      // Rest of your existing loadNutritionData function
      const localData = await getNutritionLocally();
      if (localData) {
        // Ensure all values are numbers
        setNutritionData({
          calorie: parseFloat(localData.calorie) || 0,
          glucide: parseFloat(localData.glucide) || 0,
          lipide: parseFloat(localData.lipide) || 0,
          proteine: parseFloat(localData.proteine) || 0,
        });
        console.log('Données chargées depuis le stockage local:', localData);
      } else {
        // Si aucune donnée locale, charger depuis Firebase
        const nutritionRef = doc(db, `users/${userId}/${date}`, 'nutrition');
        const nutritionSnap = await getDoc(nutritionRef);
        if (nutritionSnap.exists()) {
          const firebaseData = nutritionSnap.data();
          console.log('Données chargées depuis Firebase:', firebaseData);
          const parsedData = {
            calorie: parseFloat(firebaseData.calorie) || 0,
            glucide: parseFloat(firebaseData.glucide) || 0,
            lipide: parseFloat(firebaseData.lipide) || 0,
            proteine: parseFloat(firebaseData.proteine) || 0,
          };
          setNutritionData(parsedData);
          await saveNutritionLocally(parsedData);
        }
        // Update the last saved date
        await AsyncStorage.setItem(LAST_SAVED_DATE_KEY, date);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données nutritionnelles:', error);
      // Set default values in case of error
      setNutritionData({
        calorie: 0,
        glucide: 0,
        lipide: 0,
        proteine: 0,
      });
    }
  };

  // Sauvegarder les données localement
  const saveNutritionLocally = async (data) => {
    try {
      await AsyncStorage.setItem(LOCAL_NUTRITION_KEY, JSON.stringify(data));
      // Also save the current date whenever we save nutrition data
      await AsyncStorage.setItem(LAST_SAVED_DATE_KEY, date);
      console.log('Données nutritionnelles sauvegardées localement:', data);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde locale des données nutritionnelles:', error);
    }
  };

  // Récupérer les données locales
  const getNutritionLocally = async () => {
    try {
      const data = await AsyncStorage.getItem(LOCAL_NUTRITION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Erreur lors de la récupération des données nutritionnelles locales:', error);
      return null;
    }
  };

  // Fonction pour parser les données nutritionnelles à partir de la réponse textuelle
  const parseNutritionData = (text) => {
    try {
      console.log('Texte à parser:', text);

      // Utiliser des expressions régulières pour extraire les valeurs en français
      const calorieMatch = text.match(/Calories: (\d+\.?\d*)/i) || text.match(/Calories?: (\d+\.?\d*)/i);
      const glucideMatch = text.match(/Glucides: (\d+\.?\d*)/i) || text.match(/Carbohydrates: (\d+\.?\d*)/i);
      const lipideMatch = text.match(/Lipides: (\d+\.?\d*)/i) || text.match(/Fat: (\d+\.?\d*)/i) || text.match(/Graisses: (\d+\.?\d*)/i);
      const proteineMatch = text.match(/Protéines: (\d+\.?\d*)/i) || text.match(/Protein: (\d+\.?\d*)/i);

      const results = {
        calorie: calorieMatch ? parseFloat(calorieMatch[1]) : 0,
        glucide: glucideMatch ? parseFloat(glucideMatch[1]) : 0,
        lipide: lipideMatch ? parseFloat(lipideMatch[1]) : 0,
        proteine: proteineMatch ? parseFloat(proteineMatch[1]) : 0,
      };

      console.log('Résultats du parsing:', results);
      return results;
    } catch (error) {
      console.error('Erreur lors du parsing des données nutritionnelles:', error);
      return {
        calorie: 0,
        glucide: 0,
        lipide: 0,
        proteine: 0,
      };
    }
  };

  // Sélectionner un aliment depuis les suggestions
  const selectFood = (food) => {
    setFoodName(food.name);
    setShowSuggestions(false);
  };

  // Calculer les valeurs nutritionnelles à partir de la base de données
  const calculateNutritionFromDatabase = (foodName, quantity) => {
    const food = foodDatabase.find(item => item.name.toLowerCase() === foodName.toLowerCase());

    if (food) {
      const factor = parseFloat(quantity) / 100; // Conversion pour 100g
      return {
        calorie: food.calorie * factor,
        glucide: food.glucide * factor,
        lipide: food.lipide * factor,
        proteine: food.proteine * factor
      };
    }

    return null; // Si l'aliment n'est pas trouvé
  };

  // Ajouter un aliment
  const addMeal = async () => {
    console.log('Début de la fonction addMeal');
    console.log(`Aliment: ${foodName}, Quantité: ${quantity}g`);

    if (!foodName.trim() || !quantity.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un aliment et une quantité.');
      return;
    }

    try {
      let mealNutrition;

      // Vérifier d'abord si l'aliment existe dans notre base de données
      const dbNutrition = calculateNutritionFromDatabase(foodName, quantity);

      if (dbNutrition) {
        console.log('Aliment trouvé dans la base de données locale');
        mealNutrition = dbNutrition;
      } else {
        console.log('Aliment non trouvé dans la base de données, utilisation de l\'API OpenAI');
        // Appeler l'API Open AI pour obtenir les informations nutritionnelles
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
              model: 'gpt-3.5-turbo',
              messages: [
                {
                  role: 'system',
                  content: 'Vous êtes un expert en nutrition. Fournissez les informations nutritionnelles pour les aliments dans le format suivant: "Calories: X kcal, Glucides: Y g, Lipides: Z g, Protéines: W g". Ajustez les valeurs en fonction de la quantité fournie.'
                },
                {
                  role: 'user',
                  content: `Fournissez les informations nutritionnelles pour ${quantity} grammes de ${foodName}.`
                }
              ],
              max_tokens: 100,
              temperature: 0.5,
            },
            {
              headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
              }
            }
        );

        console.log('Réponse reçue de l\'API OpenAI');

        // Extraire les informations nutritionnelles de la réponse
        const nutritionText = response.data.choices[0].message.content;
        console.log('Texte de réponse de l\'API:', nutritionText);

        mealNutrition = parseNutritionData(nutritionText);
      }

      console.log('Données nutritionnelles pour ce Aliment:', mealNutrition);

      // Charger les données actuelles
      let currentData = await getNutritionLocally();
      if (!currentData) {
        currentData = {
          calorie: 0,
          glucide: 0,
          lipide: 0,
          proteine: 0,
        };
      }
      console.log('Données actuelles avant addition:', currentData);

      // Ensure currentData values are numbers
      const currentCalorie = parseFloat(currentData.calorie) || 0;
      const currentGlucide = parseFloat(currentData.glucide) || 0;
      const currentLipide = parseFloat(currentData.lipide) || 0;
      const currentProteine = parseFloat(currentData.proteine) || 0;

      // Additionner les nouvelles valeurs dans le document temporaire
      const updatedData = {
        calorie: currentCalorie + mealNutrition.calorie,
        glucide: currentGlucide + mealNutrition.glucide,
        lipide: currentLipide + mealNutrition.lipide,
        proteine: currentProteine + mealNutrition.proteine,
      };
      console.log('Données après addition:', updatedData);

      // Mettre à jour l'état et sauvegarder localement
      setNutritionData(updatedData);
      await saveNutritionLocally(updatedData);

      // Écraser les données sur Firebase
      console.log('Écrasement des données sur Firebase');
      await syncNutritionWithFirebase(updatedData);

      // Réinitialiser les champs et fermer le modal
      setFoodName('');
      setQuantity('');
      setModalVisible(false);
      console.log('Aliment ajouté avec succès');
    } catch (error) {
      console.error('Erreur lors de lajout du Aliment:', error.response ? error.response.data : error.message);

      let errorMessage = 'Erreur lors du calcul des données nutritionnelles';
      if (error.response && error.response.status === 401) {
        errorMessage = 'Clé API invalide. Vérifiez votre clé Open AI.';
      } else if (error.response && error.response.status === 429) {
        errorMessage = 'Trop de requêtes. Veuillez réessayer plus tard.';
      }
      Alert.alert('Erreur', errorMessage);
      setFoodName('');
      setQuantity('');
      setModalVisible(false);
    }
  };

  // Synchroniser avec Firebase en écrasant le document existant
  const syncNutritionWithFirebase = async (updatedData) => {
    try {
      const nutritionRef = doc(db, `users/${userId}/${date}`, 'nutrition');

      // Convertir les valeurs numériques en chaînes pour Firestore
      const dataToSave = {
        calorie: updatedData.calorie.toString(),
        glucide: updatedData.glucide.toString(),
        lipide: updatedData.lipide.toString(),
        proteine: updatedData.proteine.toString(),
      };

      // Écraser le document existant avec les nouvelles données
      await setDoc(nutritionRef, dataToSave);
      console.log('Données nutritionnelles écrasées dans Firebase:', dataToSave);

    } catch (error) {
      console.error('Erreur lors de la synchronisation avec Firebase:', error);
    }
  };

  // Helper function to safely get formatted values
  const formatValue = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? '0.0' : num.toFixed(1);
  };

  return (
      <View style={styles.container}>
        <Header title="Nutrition" />
        <ScrollView style={styles.scrollContainer}>
          {/* Afficher les totaux de la journée */}
          <View style={styles.totalsContainer}>
            <Text style={styles.totalsTitle}>Totaux de la journée</Text>
            <View style={styles.totalsContent}>
              <Text style={styles.totalItem}>Calories: {formatValue(nutritionData.calorie)} kcal</Text>
              <Text style={styles.totalItem}>Glucides: {formatValue(nutritionData.glucide)} g</Text>
              <Text style={styles.totalItem}>Lipides: {formatValue(nutritionData.lipide)} g</Text>
              <Text style={styles.totalItem}>Protéines: {formatValue(nutritionData.proteine)} g</Text>
            </View>
          </View>

          {/* Bouton pour ajouter un aliment */}
          <TouchableOpacity
              style={styles.addMealButton}
              onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add-circle" size={24} color="#4CAF50" />
            <Text style={styles.addMealButtonText}>Ajouter un aliment</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Modal pour ajouter un aliment */}
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Ajouter un aliment</Text>

              <Text style={styles.inputLabel}>Aliment</Text>
              <TextInput
                  style={styles.input}
                  placeholder="Ex: Poulet"
                  value={foodName}
                  onChangeText={setFoodName}
              />

              {/* Afficher les suggestions */}
              {showSuggestions && (
                  <View style={styles.suggestionsContainer}>
                    <FlatList
                        data={suggestions}
                        keyExtractor={(item) => item.name}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.suggestionItem}
                                onPress={() => selectFood(item)}
                            >
                              <Text style={styles.suggestionText}>{item.name}</Text>
                              <Text style={styles.suggestionDetails}>
                                {item.calorie} kcal/100g
                              </Text>
                            </TouchableOpacity>
                        )}
                        style={styles.suggestionsList}
                        nestedScrollEnabled={true}
                    />
                  </View>
              )}

              <Text style={styles.inputLabel}>Quantité (g)</Text>
              <TextInput
                  style={styles.input}
                  placeholder="Ex: 100"
                  keyboardType="numeric"
                  value={quantity}
                  onChangeText={setQuantity}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => {
                      setModalVisible(false);
                      setFoodName('');
                      setQuantity('');
                    }}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={addMeal}
                >
                  <Text style={styles.saveButtonText}>Ajouter</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
  );
};

export default NutritionScreen;