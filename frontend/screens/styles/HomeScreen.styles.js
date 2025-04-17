import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  userTitle: {
    fontSize: 25,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  textResumeDay: {
    fontSize: 25,
    fontWeight: '600',
    marginTop: 10,
    marginLeft: 10,
    textAlign: 'center',
    color: '#333',
  },
  dateSelected: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 10,
    marginLeft: 10,
    textAlign: 'center',
    color: '#333',
  },
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
  // Amélioration du visuel de l'insight du jour
  insightContainer: {
    marginTop: 20,
    marginHorizontal: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    minHeight: 200, // ajoute ça 👈
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#4A90E2',
    textAlign: 'center',
  },
  insightText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
