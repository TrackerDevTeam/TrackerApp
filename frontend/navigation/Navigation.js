import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, StyleSheet, Text, View } from 'react-native';

// Import des écrans
import HomeScreen from '../screens/HomeScreen';
import NutritionScreen from '../screens/NutritionScreen';
import WatchScreen from '../screens/WatchScreen';
import WorkoutScreen from '../screens/WorkoutScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import StartSleepScreen from '../screens/StartSleepScreen';
import SleepScreen from '../screens/SleepScreen';

// Import des icônes
import homeIcon from '../assets/icon/home.png';
import nutritionIcon from '../assets/icon/nutrition.png';
import workoutIcon from '../assets/icon/training.png';
import watchIcon from '../assets/icon/montre.png';
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
const Stack = createStackNavigator();
const SleepStack = createNativeStackNavigator();

const SleepStackScreen = () => (
    <SleepStack.Navigator>
      <SleepStack.Screen name="SleepMain" component={SleepScreen} options={{ headerShown: false }} />
      <SleepStack.Screen name="StartSleep" component={StartSleepScreen} options={{ title: 'Démarrer une nuit' }} />
    </SleepStack.Navigator>
  );


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
                    } else if (route.name === 'Watch') {
                    iconSource = watchIcon;
                    }

                    return (
                        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 25 }}>
                            <Image
                                source={iconSource}
                                style={[
                                    styles.icon,
                                    { tintColor: focused ? '#003087' : '#748c94' },
                                ]}
                            />
                        </View>
                    );
                },
                tabBarLabel: ({ focused }) => (
                    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 21 }}>
                        <Text style={{ color: focused ? '#003087' : '#748c94', fontSize: 14 }}>
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
            <Tab.Screen name="Sleep" component={SleepStackScreen} />
            <Tab.Screen name="Watch" component={WatchScreen} />
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
