// NutritionScreen.styles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  totalsContainer: {
    backgroundColor: '#e8f5e9',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  totalsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  totalsContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  totalItem: {
    width: '50%',
    marginBottom: 5,
    fontWeight: '500',
  },
  addMealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 10,
    justifyContent: 'center',
  },
  addMealButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // Styles pour le système de suggestions
  suggestionsContainer: {
    maxHeight: 150,
    width: '100%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  suggestionsList: {
    width: '100%',
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  suggestionText: {
    fontSize: 16,
  },
  suggestionDetails: {
    fontSize: 14,
    color: '#666',
  },
});
