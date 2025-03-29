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
  const [allMeals, setAllMeals] = useState([
    { type: "breakfast", items: [] },
    { type: "lunch", items: [] },
    { type: "snack", items: [] },
    { type: "dinner", items: [] }
  ]);  
  const [quantity, setQuantity] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');

  // Fonction pour normaliser le nom du produit
  const normalizeQuery = (query) => {
    return query.toLowerCase().replace(/\s+/g, '_');
  };
  
  const fetchProduct = async (type) => {
    setError('');
    setMealType(type);
    
    if (!query.trim()) {
      setError('Veuillez entrer un aliment');
      return;
    }
  
    // Normaliser le query avant de l'utiliser dans l'URL
    const normalizedQuery = normalizeQuery(query);

    try {
      const response = await fetch(`http://192.168.1.79:5000/search?query=${normalizedQuery}&quantity=${quantity}&time=${time}&mealType=${mealType}`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        // Ajouter l'aliment au bon type de repas
        setMeals((prevMeals) => ({
          ...prevMeals,
          [type]: [...prevMeals[type], data],
        }));
        
        // Mettre à jour allMeals
        setAllMeals((prevAllMeals) => 
          prevAllMeals.map((meal) => 
            meal.type === type ? { ...meal, items: [...meal.items, data] } : meal
          )
        );
  
        // Réinitialiser la recherche
        setQuery('');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur.');
    }
  };
  

  const renderMealItemWithUnit = (item, index) => {
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
          <View style={styles.mealNutritionText}>
            <Text>Calories: {nutrition?.calories} kcal</Text>
            <Text>Protéines: {nutrition?.proteines} g</Text>
            <Text>Glucides: {nutrition?.glucides} g</Text>
            <Text>dont sucres: {nutrition?.dont_sucres} g</Text>
            <Text>Acides gras saturés: {nutrition?.acides_gras_satures} g</Text>
            <Text>Omega 3: {nutrition?.acides_gras_insatures?.polyinsatures?.omega3} g</Text>
            <Text>Omega 6: {nutrition?.acides_gras_insatures?.polyinsatures?.omega6} g</Text>
            <Text>Omega 9: {nutrition?.acides_gras_insatures?.monoinsatures?.omega9} g</Text>
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
      const nutrition = item.nutrition;
  
      return {
        calories: totals.calories + (parseFloat(nutrition?.calories) || 0),
        proteines: totals.proteines + (parseFloat(nutrition?.proteines) || 0),
        glucides: totals.glucides + (parseFloat(nutrition?.glucides) || 0),
        dont_sucres: totals.dont_sucres + (parseFloat(nutrition?.dont_sucres) || 0),
        acides_gras_satures: totals.acides_gras_satures + (parseFloat(nutrition?.acides_gras_satures) || 0),
        omega3: totals.omega3 + (parseFloat(nutrition?.acides_gras_insatures?.poly_insatures?.omega3) || 0),
        omega6: totals.omega6 + (parseFloat(nutrition?.acides_gras_insatures?.poly_insatures?.omega6) || 0),
        omega9: totals.omega9 + (parseFloat(nutrition?.acides_gras_insatures?.mono_insatures?.omega9) || 0),
        fibres: totals.fibres + (parseFloat(nutrition?.fibres) || 0),
        vitamineA: totals.vitamineA + (parseFloat(nutrition?.vitamines?.A) || 0),
        vitamineB1: totals.vitamineB1 + (parseFloat(nutrition?.vitamines?.B?.B1) || 0),
        vitamineB2: totals.vitamineB2 + (parseFloat(nutrition?.vitamines?.B?.B2) || 0),
        vitamineB3: totals.vitamineB3 + (parseFloat(nutrition?.vitamines?.B?.B3) || 0),
        vitamineB5: totals.vitamineB5 + (parseFloat(nutrition?.vitamines?.B?.B5) || 0),
        vitamineB6: totals.vitamineB6 + (parseFloat(nutrition?.vitamines?.B?.B6) || 0),
        vitamineB8: totals.vitamineB8 + (parseFloat(nutrition?.vitamines?.B?.B8) || 0),
        vitamineB9: totals.vitamineB9 + (parseFloat(nutrition?.vitamines?.B?.B9) || 0),
        vitamineB12: totals.vitamineB12 + (parseFloat(nutrition?.vitamines?.B?.B12) || 0),
        vitamineC: totals.vitamineC + (parseFloat(nutrition?.vitamines?.C) || 0),
        vitamineD: totals.vitamineD + (parseFloat(nutrition?.vitamines?.D) || 0),
        vitamineE: totals.vitamineE + (parseFloat(nutrition?.vitamines?.E) || 0),
        vitamineK: totals.vitamineK + (parseFloat(nutrition?.vitamines?.K) || 0),
        calcium: totals.calcium + (parseFloat(nutrition?.mineraux?.calcium) || 0),
        sodium: totals.sodium + (parseFloat(nutrition?.mineraux?.sodium) || 0),
        magnesium: totals.magnesium + (parseFloat(nutrition?.mineraux?.magnesium) || 0),
        potassium: totals.potassium + (parseFloat(nutrition?.mineraux?.potassium) || 0),
        zinc: totals.zinc + (parseFloat(nutrition?.oligoelements?.zinc) || 0),
        silicium: totals.silicium + (parseFloat(nutrition?.oligoelements?.silicium) || 0),
        fer: totals.fer + (parseFloat(nutrition?.oligoelements?.fer) || 0),
        selenium: totals.selenium + (parseFloat(nutrition?.oligoelements?.selenium) || 0),
      };
    }, {
      calories: 0, proteines: 0, glucides: 0, dont_sucres: 0, acides_gras_satures: 0, omega3: 0, omega6: 0, omega9: 0, fibres: 0,
      vitamineA: 0, vitamineB1: 0, vitamineB2: 0, vitamineB3: 0, vitamineB5: 0, vitamineB6: 0, vitamineB8: 0, vitamineB9: 0, vitamineB12: 0,
      vitamineC: 0, vitamineD: 0, vitamineE: 0, vitamineK: 0, calcium: 0, sodium: 0, magnesium: 0, potassium: 0, zinc: 0, silicium: 0, fer: 0, selenium: 0
    });
  };
  
  // Fonction pour regrouper les repas par type
  const groupMealsByType = (mealItems) => {
    return mealItems.reduce((groupedMeals, item) => {
      const parsedResult = JSON.parse(item.result);
      const mealType = parsedResult.type || "unknown"; // Prend le type ou "unknown" par défaut
  
      if (!groupedMeals[mealType]) {
        groupedMeals[mealType] = [];
      }
  
      groupedMeals[mealType].push(parsedResult);
      return groupedMeals;
    }, {});
  };

  // Composant pour afficher les totaux nutritionnels de chaque repas
  const PrintMealTotalsByType = ({ mealItems }) => {
    const groupedMeals = groupMealsByType(mealItems);
    
    return (
      <View>
        {Object.keys(groupedMeals).map((mealType) => {
          const totals = calculateMealTotals(groupedMeals[mealType]);
          return (
            <View key={mealType} style={styles.totalsContainer}>
              <Text style={styles.totalsTitle}>{mealType.toUpperCase()} - Total:</Text>
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
        })}
      </View>
    );
  };

  const PrintDailyTotals = ({ mealItems }) => {
    const totals = calculateMealTotals(mealItems);
  
    return (
      <View style={styles.totalsContainer}>
        <Text style={styles.totalsTitle}>Total Journalier :</Text>
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
  
  
  

  const renderMealSection = (title, mealKey) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {/*Aliment*/}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Aliment"
          value={mealType === mealKey ? query : ''}
          onChangeText={(text) => {
            setMealType(mealKey);
            setQuery(text);
          }}
          onSubmitEditing={() => fetchProduct(mealKey)}
        />
      </View>
  
      {/*Quantité*/}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Quantité"
          value={mealType === mealKey ? quantity : ''}
          onChangeText={(text) => {
            setMealType(mealKey);
            setQuantity(text);
          }}
          onSubmitEditing={() => fetchProduct(mealKey)}
        />
      </View>
  
      {/*Heure*/}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Heure (HH:mm)"
          value={mealType === mealKey ? time : ''}
          onChangeText={(text) => {
            setMealType(mealKey);
            setTime(text);
          }}
        />
      </View>
  
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => fetchProduct(mealKey)}
      >
        <Text style={styles.addButtonText}>Ajouter</Text>
      </TouchableOpacity>
  
      {meals[mealKey].map((item, index) => renderMealItemWithUnit(item, index))}
  
      {/* Afficher les totaux du repas */}
      {meals[mealKey].length > 0 && <PrintMealTotalsByType mealItems={meals[mealKey]} />}
    </View>
  );

  // const NutritionTotals = ({ mealItems }) => {
  

  
  
    return (
      <View style={styles.container}>
        <Header title="Nutrition" />
        <ScrollView style={styles.scrollContainer}>
          
          {renderMealSection("Petit-déjeuner", "breakfast")}
          {renderMealSection("Déjeuner", "lunch")}
          {renderMealSection("Collation", "snack")}
          {renderMealSection("Dîner", "dinner")}
          <PrintDailyTotals mealItems={allMeals} />  
    
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </ScrollView>
      </View>
    );
};

export default NutritionScreen;