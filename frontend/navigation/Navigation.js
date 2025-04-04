import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, StyleSheet, Text, View } from 'react-native';

// Import des écrans
import HomeScreen from '../screens/HomeScreen';
import NutritionScreen from '../screens/NutritionScreen';
import WorkoutScreen from '../screens/WorkoutScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SleepScreen from '../screens/SleepScreen';

// Import des icônes
import homeIcon from '../assets/icon/home.png';
import nutritionIcon from '../assets/icon/nutrition.png';
import workoutIcon from '../assets/icon/training.png';
import sleepIcon from '../assets/icon/sleep.png';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Configuration des écrans avec tabs
const TabScreens = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false, // Important: désactiver le header automatique
                tabBarIcon: ({ focused, size }) => {
                    let iconSource;

                    if (route.name === 'Home') {
                        iconSource = homeIcon;
                    } else if (route.name === 'Nutrition') {
                        iconSource = nutritionIcon;
                    } else if (route.name === 'Workout') {
                        iconSource = workoutIcon;
                    } else if (route.name === 'Sleep') {
                        iconSource = sleepIcon;
                    }

                    return (
                        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 25 }}>
                            <Image
                                source={iconSource}
                                style={[
                                    styles.icon,
                                    { tintColor: focused ? '#e32f45' : '#748c94' },
                                ]}
                            />
                        </View>
                    );
                },
                tabBarLabel: ({ focused }) => (
                    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 21 }}>
                        <Text style={{ color: focused ? '#e32f45' : '#748c94', fontSize: 14 }}>
                            {route.name}
                        </Text>
                    </View>
                ),
                tabBarStyle: styles.tabBar,
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Nutrition" component={NutritionScreen} />
            <Tab.Screen name="Workout" component={WorkoutScreen} />
            <Tab.Screen name="Sleep" component={SleepScreen} />
        </Tab.Navigator>
    );
};

// Navigateur principal
const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false // Désactiver tous les headers automatiques par défaut
                }}
            >
                <Stack.Screen name="Main" component={TabScreens} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#fff',
        borderTopWidth: 0,
        height: 80,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 2,
    },
    icon: {
        width: 35,
        height: 35,
    },
});

export default Navigation;
