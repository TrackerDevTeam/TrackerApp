import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native'; // Ajout de Image
import HomeScreen from '../screens/HomeScreen';
import NutritionScreen from '../screens/NutritionScreen';
import WatchScreen from '../screens/WatchScreen';
import WorkoutScreen from '../screens/WorkoutScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Importation des images personnalisées
import homeIcon from '../assets/icon/home.png';
import homeIconFocused from '../assets/icon/home.png';
import nutritionIcon from '../assets/icon/nutrition.png';
import nutritionIconFocused from '../assets/icon/nutrition.png';
import workoutIcon from '../assets/icon/training.png';
import workoutIconFocused from '../assets/icon/training.png';
import profileIcon from '../assets/icon/profile.png';
import profileIconFocused from '../assets/icon/profile.png';
import settingsIcon from '../assets/icon/settings.png';
import settingsIconFocused from '../assets/icon/settings.png';
import watchIcon from '../assets/icon/montre.png';
import watchIconFocused from '../assets/icon/montre.png';
// Ajoute les autres images de la même manière...

const Tab = createBottomTabNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: '#fff',
                        borderTopWidth: 0,
                        paddingBottom: 10,
                        paddingTop: 10,
                        height: 60,
                    },
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconSource;

                        if (route.name === 'Home') {
                            iconSource = focused ? homeIconFocused : homeIcon;
                        } else if (route.name === 'Nutrition') {
                            iconSource = focused ? nutritionIconFocused : nutritionIcon;
                        } else if (route.name === 'Workout') {
                            iconSource = focused ? workoutIconFocused : workoutIcon; // À définir
                        } else if (route.name === 'Watch') {
                            iconSource = focused ? watchIconFocused : watchIcon; // À définir
                        } else if (route.name === 'Profile') {
                            iconSource = focused ? profileIconFocused : profileIcon; // À définir
                        } else if (route.name === 'Settings') {
                            iconSource = focused ? settingsIconFocused : settingsIcon; // À définir
                        }

                        return <Image source={iconSource} style={{ width: size, height: size }} />;
                    },
                    tabBarLabel: () => null, // Pas de texte
                    tabBarActiveTintColor: '#FFD700',
                    tabBarInactiveTintColor: '#aaa',
                })}
                initialRouteName="Home"
            >
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Nutrition" component={NutritionScreen} />
                <Tab.Screen name="Workout" component={WorkoutScreen} />
                <Tab.Screen name="Watch" component={WatchScreen} />
                <Tab.Screen name="Profile" component={ProfileScreen} />
                <Tab.Screen name="Settings" component={SettingsScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
 