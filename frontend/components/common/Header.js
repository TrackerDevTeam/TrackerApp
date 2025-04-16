import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';

// Import your icons
import profileIcon from '../../assets/icon/profile.png';
import settingsIcon from '../../assets/icon/settings.png';
import backIcon from '../../assets/icon/back.png'; // Ajoutez cette icône

const Header = ({ title }) => {
  return (
      <View style={{ padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>{title}</Text>
      </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerButton: {
    padding: 5,
    width: 50, // Fixer une largeur pour l'espace
    alignItems: 'center',
  },
  headerIcon: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
  },
});

export default Header;
