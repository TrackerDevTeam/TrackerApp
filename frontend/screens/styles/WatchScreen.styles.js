import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    marginLeft: 10, // Left margin for all elements except Header
    marginRight: 10, // Optional: balance with right margin
  },
  textBLE: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginVertical: 10,
  },
  deviceItem: {
    marginBottom: 10,
    paddingVertical: 5,
  },
  deviceText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  connectedSection: {
    marginVertical: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  connectedText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  sensorStatus: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  healthSection: {
    marginTop: 20,
    marginBottom: 25,
    paddingBottom: 15,
  },
  titlePage: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  dataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  dataText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});