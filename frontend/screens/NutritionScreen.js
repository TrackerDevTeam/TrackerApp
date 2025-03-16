// NutritionScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import Header from '../components/common/Header';
import styles from './styles/NutritionScreen.styles';

const NutritionScreen = () => {
  const [mealType, setMealType] = useState('');
  const [query, setQuery] = useState('');
  const [meals, setMeals] = useState({
    breakfast: [],
    lunch: [],
    dinner: []
  });
  const [error, setError] = useState('');
  
  const fetchProduct = async (type) => {
    setError('');
    setMealType(type);
    
    if (!query.trim()) {
      setError('Veuillez entrer un aliment');
      return;
    }
    
    try {
      const response = await fetch(`http://192.168.1.79:5000/search?query=${query}`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        // Ajouter l'aliment à la section correspondante
        if (type === 'breakfast') {
          setMeals({...meals, breakfast: [...meals.breakfast, data]});
        } else if (type === 'lunch') {
          setMeals({...meals, lunch: [...meals.lunch, data]});
        } else if (type === 'dinner') {
          setMeals({...meals, dinner: [...meals.dinner, data]});
        }
        
        // Réinitialiser la recherche
        setQuery('');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur.');
    }
  };
  
  // Fonction pour calculer les totaux nutritionnels d'un repas
  const calculateMealTotals = (mealItems) => {
    return mealItems.reduce((totals, item) => {
      return {
        calories: totals.calories + (parseFloat(item.calories) || 0),
        proteins: totals.proteins + (parseFloat(item.proteins) || 0),
        carbohydrates: totals.carbohydrates + (parseFloat(item.carbohydrates) || 0),
        fat: totals.fat + (parseFloat(item.fat) || 0)
      };
    }, { calories: 0, proteins: 0, carbohydrates: 0, fat: 0 });
  };
  
  // Composant pour afficher les totaux nutritionnels
  const NutritionTotals = ({ mealItems }) => {
    const totals = calculateMealTotals(mealItems);
    
    return (
      <View style={styles.totalsContainer}>
        <Text style={styles.totalsTitle}>Total:</Text>
        <View style={styles.totalsContent}>
          <Text style={styles.totalItem}>Calories: {totals.calories.toFixed(1)} kcal</Text>
          <Text style={styles.totalItem}>Protéines: {totals.proteins.toFixed(1)} g</Text>
          <Text style={styles.totalItem}>Glucides: {totals.carbohydrates.toFixed(1)} g</Text>
          <Text style={styles.totalItem}>Lipides: {totals.fat.toFixed(1)} g</Text>
        </View>
      </View>
    );
  };
  
  const renderMealItem = (item, index) => {
    return (
      <View key={index} style={styles.mealItem}>
        <Text style={styles.mealItemTitle}>{item.name}</Text>
        <View style={styles.mealItemDetails}>
          {item.image && (
            <Image 
              source={{ uri: item.image }} 
              style={styles.mealImage} 
              resizeMode="contain"
            />
          )}
          <View style={styles.mealNutrition}>
            <Text>Calories: {item.calories} kcal</Text>
            <Text>Protéines: {item.proteins} g</Text>
            <Text>Glucides: {item.carbohydrates} g</Text>
            <Text>Lipides: {item.fat} g</Text>
          </View>
        </View>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <Header title="Nutrition" />
      <ScrollView style={styles.scrollContainer}>
        {/* Petit-déjeuner */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Petit-déjeuner</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Entrez un aliment"
              value={mealType === 'breakfast' ? query : ''}
              onChangeText={(text) => {
                setMealType('breakfast');
                setQuery(text);
              }}
              onSubmitEditing={() => fetchProduct('breakfast')}
            />
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => fetchProduct('breakfast')}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          
          {meals.breakfast.map((item, index) => renderMealItem(item, index))}
          
          {/* Afficher les totaux du petit-déjeuner */}
          {meals.breakfast.length > 0 && <NutritionTotals mealItems={meals.breakfast} />}
        </View>
        
        {/* Déjeuner */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Déjeuner</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Entrez un aliment"
              value={mealType === 'lunch' ? query : ''}
              onChangeText={(text) => {
                setMealType('lunch');
                setQuery(text);
              }}
              onSubmitEditing={() => fetchProduct('lunch')}
            />
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => fetchProduct('lunch')}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          
          {meals.lunch.map((item, index) => renderMealItem(item, index))}
          
          {/* Afficher les totaux du déjeuner */}
          {meals.lunch.length > 0 && <NutritionTotals mealItems={meals.lunch} />}
        </View>
        
        {/* Dîner */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dîner</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Entrez un aliment"
              value={mealType === 'dinner' ? query : ''}
              onChangeText={(text) => {
                setMealType('dinner');
                setQuery(text);
              }}
              onSubmitEditing={() => fetchProduct('dinner')}
            />
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => fetchProduct('dinner')}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          
          {meals.dinner.map((item, index) => renderMealItem(item, index))}
          
          {/* Afficher les totaux du dîner */}
          {meals.dinner.length > 0 && <NutritionTotals mealItems={meals.dinner} />}
        </View>
        
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>
    </View>
  );
};

export default NutritionScreen;