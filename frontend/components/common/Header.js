import React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, StatusBar, Platform } from 'react-native';

// Placeholder pour les images
const LOGO_IMAGE = require('../../assets/images/logo.png');
const USER_IMAGE = require('../../assets/images/user.png');

const Header = ({ title = 'Tracker CLI' }) => {
  return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          {/* Logo à gauche */}
          <Image source={LOGO_IMAGE} style={styles.logo} />

          {/* Titre au centre */}
          <Text style={styles.title}>{title}</Text>

          {/* Cercle pour l'image utilisateur à droite */}
          <Image source={USER_IMAGE} style={styles.userImage} />
        </View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover',
  },
});

export default Header;