import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Header from '../components/common/Header';
import styles from './styles/HomeScreen.styles';

const HomeScreen = () => {
    return (
        <View style={styles.container}>
            <Header title="Accueil" />
            <View style={styles.content}>
                <Text>Bienvenue dans Tracker notre projet de M2</Text>
                <Image source={require('../assets/icon/home.png')} style={{ width: 50, height: 50 }} />
            </View>
        </View>
    );
};

export default HomeScreen;
