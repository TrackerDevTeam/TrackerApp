import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/common/Header'; // Ajustez le chemin selon votre structure

const SleepScreen = () => {
    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.content}>
                <Text style={styles.profileText}>
                    Écran de sleep
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
    profileText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#333',
    },
});

export default SleepScreen;
