import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Icônes placeholders (remplacez par vos images)
const icons = {
  home: require('../../assets/images/training.png'),
  workout: require('../../assets/images/nutrition.png'),
  profile: require('../../assets/images/sleep.png'),
  settings: require('../../assets/images/bracelet.png'),
};

const Footer = () => {
  const navigation = useNavigation();

  const navItems = [
    { name: 'training', icon: icons.home, screen: 'training' },
    { name: 'nutrition', icon: icons.workout, screen: 'nutrition' },
    { name: 'sleep', icon: icons.profile, screen: 'sleep' },
    { name: 'bracelet', icon: icons.settings, screen: 'bracelet' },
  ];

  return (
    <View style={styles.footerContainer}>
      {navItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.navItem}
          onPress={() => navigation.navigate(item.screen)}
        >
          <Image source={item.icon} style={styles.icon} />
          <Text style={styles.navText}>{item.navName}</Text>
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
    resizeMode: 'contain',
  },
  navText: {
    fontSize: 12,
    color: '#333',
  },
});

export default Footer;