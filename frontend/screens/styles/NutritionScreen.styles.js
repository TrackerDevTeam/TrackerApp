// NutritionScreen.styles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FA', // Fond gris-bleu très clair
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  totalsContainer: {
    backgroundColor: '#E6F0FA', // Bleu très clair pour le fond
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#CDE4F5', // Bordure subtile
  },
  totalsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#003087', // Bleu foncé PayPal pour les titres
  },
  totalsContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  totalItem: {
    width: '50%',
    marginBottom: 5,
    fontWeight: '500',
    color: '#000000', // Bleu moyen pour le texte
  },
  addMealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#009CDE', // Bleu clair PayPal
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    justifyContent: 'center',
  },
  addMealButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#FFFFFF', // Texte blanc pour contraste
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: '#CDE4F5', // Bordure subtile
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#003087', // Bleu foncé PayPal
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    color: '#005EA6', // Bleu moyen
  },
  input: {
    borderWidth: 1,
    borderColor: '#CDE4F5', // Bordure bleu clair
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#F5F8FA', // Fond gris-bleu clair
    color: '#003087', // Texte bleu foncé
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
    backgroundColor: '#E6F0FA', // Bleu très clair
  },
  cancelButtonText: {
    color: '#005EA6', // Bleu moyen
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#0070BA', // Bleu principal PayPal
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  suggestionsContainer: {
    maxHeight: 150,
    width: '100%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#CDE4F5', // Bordure bleu clair
    borderRadius: 5,
    backgroundColor: '#F5F8FA', // Fond gris-bleu clair
  },
  suggestionsList: {
    width: '100%',
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E6F0FA', // Séparateur bleu clair
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  suggestionText: {
    fontSize: 16,
    color: '#003087', // Bleu foncé
  },
  suggestionDetails: {
    fontSize: 14,
    color: '#005EA6', // Bleu moyen
  },
});