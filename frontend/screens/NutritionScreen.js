// NutritionScreen.js
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Assurez-vous que le chemin est correct
import { UserContext } from '../../UserContext';
import Header from '../components/common/Header';
import styles from './styles/NutritionScreen.styles';
import axios from 'axios';

const LOCAL_NUTRITION_KEY = 'localNutritionData';
const API_KEY = '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';

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

  // Charger les données au démarrage
  useEffect(() => {
    loadNutritionData();
  }, []);

  // Charger les données locales et synchroniser avec Firebase
  const loadNutritionData = async () => {
    try {
      // Charger les données locales
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

      // Utiliser des expressions régulières pour extraire les valeurs
      const calorieMatch = text.match(/Calories: (\d+\.?\d*)/);
      const glucideMatch = text.match(/Carbohydrates: (\d+\.?\d*)/);
      const lipideMatch = text.match(/Fat: (\d+\.?\d*)/);
      const proteineMatch = text.match(/Protein: (\d+\.?\d*)/);

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

  // Ajouter un repas
  const addMeal = async () => {
    console.log('Début de la fonction addMeal');
    console.log(`Aliment: ${foodName}, Quantité: ${quantity}g`);

    if (!foodName.trim() || !quantity.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un aliment et une quantité.');
      return;
    }

    try {
      console.log('Préparation de la requête à l\'API OpenAI');
      // Appeler l'API Open AI pour obtenir les informations nutritionnelles
      const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: 'You are a nutrition expert. Provide nutritional information for foods in the following format: "Calories: X kcal, Carbohydrates: Y g, Fat: Z g, Protein: W g". Adjust the values based on the quantity provided.'
              },
              {
                role: 'user',
                content: `Provide the nutritional information for ${quantity} grams of ${foodName}.`
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

      const mealNutrition = parseNutritionData(nutritionText);
      console.log('Données nutritionnelles pour ce repas:', mealNutrition);

      // Créer un document local temporaire pour l'addition
      console.log('Création du document local temporaire pour calculs');

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
      console.log('Repas ajouté avec succès');
    } catch (error) {
      console.error('Erreur lors de l’ajout du repas:', error.response ? error.response.data : error.message);

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

          {/* Bouton pour ajouter un repas */}
          <TouchableOpacity
              style={styles.addMealButton}
              onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add-circle" size={24} color="#4CAF50" />
            <Text style={styles.addMealButtonText}>Ajouter un repas</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Modal pour ajouter un repas */}
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Ajouter un repas</Text>

              <Text style={styles.inputLabel}>Aliment</Text>
              <TextInput
                  style={styles.input}
                  placeholder="Ex: Poulet grillé"
                  value={foodName}
                  onChangeText={setFoodName}
              />

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
