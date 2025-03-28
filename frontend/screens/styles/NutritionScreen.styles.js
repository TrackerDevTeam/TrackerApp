// NutritionScreen.css
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    elevation: 3, // Ombre pour l'effet de survol
  },
  addButtonText: {
    color: 'white',
    fontSize: 18, // Plus grand pour une meilleure lisibilité
    fontWeight: 'bold',
  },  
  // Style des éléments de repas
  mealItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000', // Ombre douce pour donner un effet de profondeur
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5, // Ombre sur Android
    borderWidth: 0.5,
    borderColor: '#ddd',
  },
  mealItemTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#333',
  },
  mealItemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealNutrition: {
    flex: 1,
    justifyContent: 'center',
  },
  mealNutritionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  error: {
    color: '#D32F2F',
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '500',
  },
  // Styles pour les totaux journaliers
  totalsContainer: {
    backgroundColor: '#e8f5e9',
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  totalsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#333',
  },
  totalsContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  totalItem: {
    width: '48%', // Deux éléments par ligne
    marginBottom: 8,
    fontWeight: '500',
    fontSize: 14,
    color: '#333',
  },
});
