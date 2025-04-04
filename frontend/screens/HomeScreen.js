import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/common/Header'; // Ajustez le chemin selon votre structure

const HomeScreen = () => {
    return (
        <View style={styles.container}>
            <Header title="Accueil" />
            <View style={styles.content}>
                <Text style={styles.welcomeText}>
                    Bienvenue dans Tracker notre projet de M2...
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    welcomeText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#333',
    },
});

export default HomeScreen;
