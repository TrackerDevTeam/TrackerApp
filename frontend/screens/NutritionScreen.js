// NutritionScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import Header from '../components/common/Header';
import styles from './styles/NutritionScreen.styles';

const NutritionScreen = () => {
  const [mealType, setMealType] = useState('');
  const [query, setQuery] = useState('');
  const [meals, setMeals] = useState({
    breakfast: [],
    lunch: [],
    snack: [],
    dinner: []
  });
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');
  
  const fetchProduct = async (type) => {
    setError('');
    setMealType(type);
    
    if (!query.trim()) {
      setError('Veuillez entrer un aliment');
      return;
    }

    
    try {
      const response = await fetch(`http://192.168.1.79:5000/search?query=${query}&quantity=${quantity}`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        // Ajouter l'aliment à la section correspondante
        if (type === 'breakfast') {
          setMeals({...meals, breakfast: [...meals.breakfast, data]});
        } else if (type === 'lunch') {
          setMeals({...meals, lunch: [...meals.lunch, data]});
        } else if (type === 'snack') {
          setMeals({...meals, snack: [...meals.snack, data]});
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

  const renderMealItem = (item, index) => {
    const parsedResult = JSON.parse(item.result);
    const { product_name, quantity, nutrition } = parsedResult;
    return (
      <View key={index} style={styles.mealItem}>
      {/* Affichage du nom du produit et de la quantité */}
      <Text style={styles.mealItemTitle}>
        {product_name} - {quantity}
      </Text>
        <Text style={styles.mealItemTitle}>{item.name}</Text>
        <View style={styles.mealItemDetails}>
          <View style={styles.mealNutrition}>
            <Text>Calories: {nutrition?.calories} kcal</Text>
            <Text>Protéines: {nutrition?.proteines} g</Text>
            <Text>Glucides: {nutrition?.glucides} g</Text>
            <Text>dont sucres: {nutrition?.dont_sucres} g</Text>
            <Text>Acides gras saturés: {nutrition?.acides_gras_satures} g</Text>
            <Text>Omega 3: {nutrition?.acides_gras_insatures?.poly_insatures?.omega3} g</Text>
            <Text>Omega 6: {nutrition?.acides_gras_insatures?.poly_insatures?.omega6} g</Text>
            <Text>Omega 9: {nutrition?.acides_gras_insatures?.mono_insatures?.omega9} g</Text>
            <Text>Fibres: {nutrition?.fibres} g</Text>
            <Text>Vitamine A: {nutrition?.vitamines?.A} µg</Text>
            <Text>Vitamine B1: {nutrition?.vitamines?.B?.B1} µg</Text>
            <Text>Vitamine B2: {nutrition?.vitamines?.B?.B2} µg</Text>
            <Text>Vitamine B3: {nutrition?.vitamines?.B?.B3} mg</Text>
            <Text>Vitamine B5: {nutrition?.vitamines?.B?.B5} mg</Text>
            <Text>Vitamine B6: {nutrition?.vitamines?.B?.B6} mg</Text>
            <Text>Vitamine B8: {nutrition?.vitamines?.B?.B8} µg</Text>
            <Text>Vitamine B9: {nutrition?.vitamines?.B?.B9} µg</Text>
            <Text>Vitamine B12: {nutrition?.vitamines?.B?.B12} µg</Text>
            <Text>Vitamine C: {nutrition?.vitamines?.C} mg</Text>
            <Text>Vitamine D: {nutrition?.vitamines?.D} µg</Text>
            <Text>Vitamine E: {nutrition?.vitamines?.E} mg</Text>
            <Text>Vitamine K: {nutrition?.vitamines?.K} µg</Text>
            <Text>Calcium: {nutrition?.mineraux?.calcium} mg</Text>
            <Text>Sodium: {nutrition?.mineraux?.sodium} mg</Text>
            <Text>Magnésium: {nutrition?.mineraux?.magnesium} mg</Text>
            <Text>Potassium: {nutrition?.mineraux?.potassium} mg</Text>
            <Text>Zinc: {nutrition?.oligoelements?.zinc} mg</Text>
            <Text>Silicium: {nutrition?.oligoelements?.silicium} mg</Text>
            <Text>Fer: {nutrition?.oligoelements?.fer} mg</Text>
            <Text>Sélénium: {nutrition?.oligoelements?.selenium} mg</Text>
          </View>
        </View>
      </View>
    );
  };
  
  // Fonction pour calculer les totaux nutritionnels d'un repas
  const calculateMealTotals = (mealItems) => {
    return mealItems.reduce((totals, item) => {
      return {
        calories: totals.calories + (parseFloat(item.nutrition?.calories) || 0),
        proteines: totals.proteines + (parseFloat(item.nutrition?.proteines) || 0),
        glucides: totals.glucides + (parseFloat(item.nutrition?.glucides) || 0),
        dont_sucres: totals.dont_sucres + (parseFloat(item.nutrition?.dont_sucres) || 0),
        acides_gras_satures: totals.acides_gras_satures + (parseFloat(item.nutrition?.acides_gras_satures) || 0),
        omega3: totals.omega3 + (parseFloat(item.nutrition?.acides_gras_insatures?.poly_insatures?.omega3) || 0),
        omega6: totals.omega6 + (parseFloat(item.nutrition?.acides_gras_insatures?.poly_insatures?.omega6) || 0),
        omega9: totals.omega9 + (parseFloat(item.nutrition?.acides_gras_insatures?.mono_insatures?.omega9) || 0),
        fibres: totals.fibres + (parseFloat(item.nutrition?.fibres) || 0),
        vitamineA: totals.vitamineA + (parseFloat(item.nutrition?.vitamines?.A) || 0),
        vitamineB1: totals.vitamineB1 + (parseFloat(item.nutrition?.vitamines?.B?.B1) || 0),
        vitamineB2: totals.vitamineB2 + (parseFloat(item.nutrition?.vitamines?.B?.B2) || 0),
        vitamineB3: totals.vitamineB3 + (parseFloat(item.nutrition?.vitamines?.B?.B3) || 0),
        vitamineB5: totals.vitamineB5 + (parseFloat(item.nutrition?.vitamines?.B?.B5) || 0),
        vitamineB6: totals.vitamineB6 + (parseFloat(item.nutrition?.vitamines?.B?.B6) || 0),
        vitamineB8: totals.vitamineB8 + (parseFloat(item.nutrition?.vitamines?.B?.B8) || 0),
        vitamineB9: totals.vitamineB9 + (parseFloat(item.nutrition?.vitamines?.B?.B9) || 0),
        vitamineB12: totals.vitamineB12 + (parseFloat(item.nutrition?.vitamines?.B?.B12) || 0),
        vitamineC: totals.vitamineC + (parseFloat(item.nutrition?.vitamines?.C) || 0),
        vitamineD: totals.vitamineD + (parseFloat(item.nutrition?.vitamines?.D) || 0),
        vitamineE: totals.vitamineE + (parseFloat(item.nutrition?.vitamines?.E) || 0),
        vitamineK: totals.vitamineK + (parseFloat(item.nutrition?.vitamines?.K) || 0),
        calcium: totals.calcium + (parseFloat(item.nutrition?.mineraux?.calcium) || 0),
        sodium: totals.sodium + (parseFloat(item.nutrition?.mineraux?.sodium) || 0),
        magnesium: totals.magnesium + (parseFloat(item.nutrition?.mineraux?.magnesium) || 0),
        potassium: totals.potassium + (parseFloat(item.nutrition?.mineraux?.potassium) || 0),
        zinc: totals.zinc + (parseFloat(item.nutrition?.oligoelements?.zinc) || 0),
        silicium: totals.silicium + (parseFloat(item.nutrition?.oligoelements?.silicium) || 0),
        fer: totals.fer + (parseFloat(item.nutrition?.oligoelements?.fer) || 0),
        selenium: totals.selenium + (parseFloat(item.nutrition?.oligoelements?.selenium) || 0),
      };
    }, { calories: 0, proteines: 0, glucides: 0, dont_sucres: 0, acides_gras_satures: 0, omega3: 0, omega6: 0, omega9: 0, fibres: 0, vitamineA: 0, vitamineB1: 0, vitamineB2: 0, vitamineB3: 0, vitamineB5: 0, vitamineB6: 0, vitamineB8: 0, vitamineB9: 0, vitamineB12: 0, vitamineC: 0, vitamineD: 0, vitamineE: 0, vitamineK: 0, calcium: 0, sodium: 0, magnesium: 0, potassium: 0, zinc: 0, silicium: 0, fer: 0, selenium: 0 });
  };
  
  // Composant pour afficher les totaux nutritionnels
  const PrintMealTotals = ({ mealItems }) => {
    const totals = calculateMealTotals(mealItems);
    
    return (
      <View style={styles.totalsContainer}>
        <Text style={styles.totalsTitle}>Total:</Text>
        <View style={styles.totalsContent}>
          <Text style={styles.totalItem}>Calories: {totals.calories.toFixed(1)} kcal</Text>
          <Text style={styles.totalItem}>Protéines: {totals.proteines.toFixed(1)} g</Text>
          <Text style={styles.totalItem}>Glucides: {totals.glucides.toFixed(1)} g</Text>
          <Text style={styles.totalItem}>dont sucres: {totals.dont_sucres.toFixed(1)} g</Text>
          <Text style={styles.totalItem}>Acides gras saturés: {totals.acides_gras_satures.toFixed(1)} g</Text>
          <Text style={styles.totalItem}>Omega 3: {totals.omega3.toFixed(1)} g</Text>
          <Text style={styles.totalItem}>Omega 6: {totals.omega6.toFixed(1)} g</Text>
          <Text style={styles.totalItem}>Omega 9: {totals.omega9.toFixed(1)} g</Text>
          <Text style={styles.totalItem}>Fibres: {totals.fibres.toFixed(1)} g</Text>
          <Text style={styles.totalItem}>Vitamine A: {totals.vitamineA.toFixed(1)} µg</Text>
          <Text style={styles.totalItem}>Vitamine B1: {totals.vitamineB1.toFixed(1)} µg</Text>
          <Text style={styles.totalItem}>Vitamine B2: {totals.vitamineB2.toFixed(1)} µg</Text>
          <Text style={styles.totalItem}>Vitamine B3: {totals.vitamineB3.toFixed(1)} mg</Text>
          <Text style={styles.totalItem}>Vitamine B5: {totals.vitamineB5.toFixed(1)} mg</Text>
          <Text style={styles.totalItem}>Vitamine B6: {totals.vitamineB6.toFixed(1)} mg</Text>
          <Text style={styles.totalItem}>Vitamine B8: {totals.vitamineB8.toFixed(1)} µg</Text>
          <Text style={styles.totalItem}>Vitamine B9: {totals.vitamineB9.toFixed(1)} µg</Text>
          <Text style={styles.totalItem}>Vitamine B12: {totals.vitamineB12.toFixed(1)} µg</Text>
          <Text style={styles.totalItem}>Vitamine C: {totals.vitamineC.toFixed(1)} mg</Text>
          <Text style={styles.totalItem}>Vitamine D: {totals.vitamineD.toFixed(1)} µg</Text>
          <Text style={styles.totalItem}>Vitamine E: {totals.vitamineE.toFixed(1)} mg</Text>
          <Text style={styles.totalItem}>Vitamine K: {totals.vitamineK.toFixed(1)} µg</Text>
          <Text style={styles.totalItem}>Calcium: {totals.calcium.toFixed(1)} mg</Text>
          <Text style={styles.totalItem}>Sodium: {totals.sodium.toFixed(1)} mg</Text>
          <Text style={styles.totalItem}>Magnésium: {totals.magnesium.toFixed(1)} mg</Text>
          <Text style={styles.totalItem}>Potassium: {totals.potassium.toFixed(1)} mg</Text>
          <Text style={styles.totalItem}>Zinc: {totals.zinc.toFixed(1)} mg</Text>
          <Text style={styles.totalItem}>Silicium: {totals.silicium.toFixed(1)} mg</Text>
          <Text style={styles.totalItem}>Fer: {totals.fer.toFixed(1)} mg</Text>
          <Text style={styles.totalItem}>Sélénium: {totals.selenium.toFixed(1)} mg</Text>
        </View>
      </View>
    );
  };

  // const NutritionTotals = ({ mealItems }) => {
  

  
  
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
              placeholder="Aliment"
              value={mealType === 'breakfast' ? query : ''}
              onChangeText={(text) => {
                setMealType('breakfast');
                setQuery(text);
              }}
              onSubmitEditing={() => fetchProduct('breakfast')}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
                placeholder="Quantité"
                value={mealType === 'breakfast' ? quantity : ''}
              onChangeText={(text) => {
                setMealType('breakfast');
                setQuantity(text);
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
          {meals.breakfast.length > 0 && <PrintMealTotals mealItems={meals.breakfast} />}
        </View>
        
        {/* Déjeuner */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Déjeuner</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Aliment"
              value={mealType === 'lunch' ? query : ''}
              onChangeText={(text) => {
                setMealType('lunch');
                setQuery(text);
              }}
              onSubmitEditing={() => fetchProduct('lunch')}
            />
          </View>
          <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Quantité"
                value={mealType === 'lunch' ? quantity : ''}
              onChangeText={(text) => {
                setMealType('lunch');
                setQuantity(text);
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
          {meals.lunch.length > 0 && <PrintMealTotals mealItems={meals.lunch} />}
          </View>

          {/* Collation */}
          <View style={styles.section}>
          <Text style={styles.sectionTitle}>Collation</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Aliment"
              value={mealType === 'snack' ? query : ''}
              onChangeText={(text) => {
                setMealType('snack');
                setQuery(text);
              }}
              onSubmitEditing={() => fetchProduct('snack')}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Quantité"
              value={mealType === 'snack' ? quantity : ''}
              onChangeText={(text) => {
                setMealType('snack');
                setQuantity(text);
              }}
              onSubmitEditing={() => fetchProduct('snack')}
            />
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => fetchProduct('snack')}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          
          {meals.snack.map((item, index) => renderMealItem(item, index))}
          
          {/* Afficher les totaux du déjeuner */}
          {meals.snack.length > 0 && <PrintMealTotals mealItems={meals.snack} />}
          </View>
        
        {/* Dîner */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dîner</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Aliment"
              value={mealType === 'dinner' ? query : ''}
              onChangeText={(text) => {
                setMealType('dinner');
                setQuery(text);
              }}
              onSubmitEditing={() => fetchProduct('dinner')}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Quantité"
              value={mealType === 'dinner' ? quantity : ''}
              onChangeText={(text) => {
                setMealType('dinner');
                setQuantity(text);
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
          {meals.dinner.length > 0 && <PrintMealTotals mealItems={meals.dinner} />}
        </View>
        
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>
    </View>
  );
};

export default NutritionScreen;