import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Exemple d'icônes
import HomeScreen from '../screens/HomeScreen';
import NutritionScreen from '../screens/NutritionScreen';
import WorkoutScreen from '../screens/WorkoutScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: '#222', // Couleur de fond (à adapter selon ton footer)
                        borderTopWidth: 0,
                        paddingBottom: 10,
                        paddingTop: 10,
                        height: 60,
                    },
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'Home') {
                            iconName = focused ? 'home' : 'home-outline';
                        } else if (route.name === 'Nutrition') {
                            iconName = focused ? 'nutrition' : 'nutrition-outline';
                        } else if (route.name === 'Workout') {
                            iconName = focused ? 'barbell' : 'barbell-outline';
                        } else if (route.name === 'Profile') {
                            iconName = focused ? 'person' : 'person-outline';
                        } else if (route.name === 'Settings') {
                            iconName = focused ? 'settings' : 'settings-outline';
                        }

                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: '#FFD700', // Couleur active (ex: doré)
                    tabBarInactiveTintColor: '#aaa', // Couleur inactive
                })}
                initialRouteName="Home"
            >
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Nutrition" component={NutritionScreen} />
                <Tab.Screen name="Workout" component={WorkoutScreen} />
                <Tab.Screen name="Profile" component={ProfileScreen} />
                <Tab.Screen name="Settings" component={SettingsScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
