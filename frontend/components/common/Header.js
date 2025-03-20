import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, StatusBar, Platform, TouchableOpacity } from 'react-native';

const USER_IMAGE = require('../../assets/images/menu.png');

const Header = ({ title = 'Tracker CLI' }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false); // État pour afficher/masquer le menu

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible); // Inverse l'état du menu
  };

  return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          {/* Titre au centre */}
          <Text style={styles.title}>{title}</Text>
          {/* Icône de menu cliquable */}
          <TouchableOpacity onPress={toggleMenu}>
            <Image source={USER_IMAGE} style={styles.userImage} />
          </TouchableOpacity>
        </View>

        {/* Menu déroulant */}
        {isMenuVisible && (
            <View style={styles.menuContainer}>
              <TouchableOpacity style={styles.menuItem} onPress={() => console.log('Option 1')}>
                <Text style={styles.menuText}>Option 1</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => console.log('Option 2')}>
                <Text style={styles.menuText}>Option 2</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => console.log('Option 3')}>
                <Text style={styles.menuText}>Option 3</Text>
              </TouchableOpacity>
            </View>
        )}
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
  menuContainer: {
    position: 'absolute',
    top: 60, // Ajuste selon la hauteur de ton header
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 5, // Ombre pour Android
    shadowColor: '#000', // Ombre pour iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 1000, // Assure que le menu est au-dessus des autres éléments
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
});

export default Header;
