import AsyncStorage from '@react-native-async-storage/async-storage';
import { simulateRawSleepData } from './simulateRawSleepData';

export const saveSimulatedDataToAsyncStorage = async (date) => {
  const data = simulateRawSleepData();
  const key = `rawSleepData_${date}`; // ex: "rawSleepData_2025-04-12"

  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
    console.log(`✅ Données simulées sauvegardées sous la clé : ${key}`);
  } catch (err) {
    console.error('❌ Erreur de sauvegarde dans AsyncStorage', err);
  }
};

