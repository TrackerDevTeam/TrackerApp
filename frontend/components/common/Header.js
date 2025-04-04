import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';

// Import your icons
import profileIcon from '../../assets/icon/profile.png';
import settingsIcon from '../../assets/icon/settings.png';
import backIcon from '../../assets/icon/back.png'; // Ajoutez cette icône

const Header = ({ title }) => {
  const navigation = useNavigation();
  const route = useRoute();

  // Déterminer dans quel écran nous sommes
  const isProfileScreen = route.name === 'Profile';
  const isSettingsScreen = route.name === 'Settings';
  const isMainScreen = !isProfileScreen && !isSettingsScreen;

  // Fonction pour naviguer vers le profil
  const goToProfile = () => {
    navigation.navigate('Profile');
  };

  // Fonction pour naviguer vers les paramètres
  const goToSettings = () => {
    navigation.navigate('Settings');
  };

  // Fonction pour revenir en arrière
  const goBack = () => {
    navigation.goBack();
  };

  return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          {/* Bouton gauche */}
          <TouchableOpacity
              style={styles.headerButton}
              onPress={isMainScreen ? goToProfile : goBack}
          >
            <Image
                source={isMainScreen ? profileIcon : backIcon}
                style={styles.headerIcon}
            />
          </TouchableOpacity>

          {/* Titre */}
          <Text style={styles.title}>
            {isProfileScreen ? 'Profil' : isSettingsScreen ? 'Paramètres' : title || 'Accueil'}
          </Text>

          {/* Bouton droit - paramètres sur les écrans principaux, rien ou autre chose sur les écrans Profile/Settings */}
          {isMainScreen ? (
              <TouchableOpacity style={styles.headerButton} onPress={goToSettings}>
                <Image source={settingsIcon} style={styles.headerIcon} />
              </TouchableOpacity>
          ) : (
                  <View style={styles.headerButton} />
          )}
        </View>
      </SafeAreaView>
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
