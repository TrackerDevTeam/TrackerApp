/*
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Importer les images PNG
const icons = {
  Home: require('../../assets/icon/home.png'),
  Nutrition: require('../../assets/icon/nutrition.png'),
  Workout: require('../../assets/icon/training.png'),
  Profile: require('../../assets/icon/profile.png'),
  Settings: require('../../assets/icon/settings.png'),
};

const Footer = () => {
  const navigation = useNavigation();

  const navItems = [
    { name: 'Home', screen: 'HomeScreen' },
    { name: 'Nutrition', screen: 'nutrition' },
    { name: 'Workout', screen: 'training' },
    { name: 'Profile', screen: 'profile' },
    { name: 'Settings', screen: 'settings' },
  ];

  return (
      <View style={styles.footerContainer}>
        {navItems.map((item, index) => (
            <TouchableOpacity
                key={index}
                style={styles.navItem}
                onPress={() => navigation.navigate(item.screen)}
            >
              <Image source={icons[item.name]} style={styles.icon} />
              <Text style={styles.navText}>{item.name}</Text>
            </TouchableOpacity>
        ))}
      </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain', // Pour garder les proportions
  },
  navText: {
    fontSize: 12,
    color: '#333',
  },
});

export default Footer;
*/
