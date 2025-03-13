import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

// Placeholder pour les images (remplacez par vos propres chemins ou URL)
const LOGO_IMAGE = require('../../assets/images/logo.png'); // Remplacez par le chemin de votre logo
const USER_IMAGE = require('../../assets/images/user.png'); // Remplacez par le chemin de votre image utilisateur

const Header = ({ title = 'Tracker CLI' }) => {
  return (
    <View style={styles.headerContainer}>
      {/* Logo à gauche */}
      <Image source={LOGO_IMAGE} style={styles.logo} />

      {/* Titre au centre */}
      <Text style={styles.title}>{title}</Text>

      {/* Cercle pour l'image utilisateur à droite */}
      <Image source={USER_IMAGE} style={styles.userImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#fff', // Couleur de fond personnalisable
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain', // Ajuste l'image sans déformation
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1, // Permet au titre de prendre l'espace restant
    textAlign: 'center',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20, // Moitié de la largeur/hauteur pour un cercle parfait
    resizeMode: 'cover', // Couvre l'espace tout en conservant les proportions
  },
});

export default Header;