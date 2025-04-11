import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native'; // Ajout de Image
import HomeScreen from '../screens/HomeScreen';
import NutritionScreen from '../screens/NutritionScreen';
import WorkoutScreen from '../screens/WorkoutScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SleepScreen from '../screens/SleepScreen';
import StartSleepScreen from '../screens/StartSleepScreen';

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
import sleepIcon from '../assets/icon/sleep.png';
import sleepIconFocused from '../assets/icon/sleep.png';
// Ajoute les autres images de la même manière...

import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator();
const SleepStack = createNativeStackNavigator();

const SleepStackScreen = () => (
    <SleepStack.Navigator>
      <SleepStack.Screen name="SleepMain" component={SleepScreen} options={{ headerShown: false }} />
      <SleepStack.Screen name="StartSleep" component={StartSleepScreen} options={{ title: 'Démarrer une nuit' }} />
    </SleepStack.Navigator>
  );


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
                        } else if (route.name === 'Profile') {
                            iconSource = focused ? profileIconFocused : profileIcon; // À définir
                        } else if (route.name === 'Settings') {
                            iconSource = focused ? settingsIconFocused : settingsIcon; // À définir
                        } else if (route.name === 'Sleep') {
                            iconSource = focused ? sleepIconFocused : sleepIcon; // À définir
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
                <Tab.Screen name="Profile" component={ProfileScreen} />
                <Tab.Screen name="Settings" component={SettingsScreen} />
                <Tab.Screen name="Sleep" component={SleepStackScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
