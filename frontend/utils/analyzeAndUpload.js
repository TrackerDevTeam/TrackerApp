import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { detectSleepPhasesFromRaw } from './detectSleepPhasesFromRaw';
import { copySleepSummaryToBilly } from './generateTrainingData'; // 👈 à ajouter si ce n’est pas déjà importé

const formatDate = (isoDate) => {
  const [y, m, d] = isoDate.split('-');
  return `${y}-${m}-${d}`; // "2025-04-12" → "2025-04-12"
};

export const analyzeAndUploadSleepData = async (date) => {
  const key = `rawSleepData_${date}`;
  try {
    const rawStr = await AsyncStorage.getItem(key);
    if (!rawStr) {
      console.warn(`⚠️ Aucune donnée brute trouvée pour ${key}`);
      return;
    }

    const rawData = JSON.parse(rawStr);
    const analyzed = detectSleepPhasesFromRaw(rawData);
    const docPath = formatDate(date);
    const ref = doc(db, 'users', 'Nico', docPath, 'sommeil');
    await setDoc(ref, { ...analyzed, raw: rawData });

    console.log(`✅ Données analysées et envoyées dans Firestore pour le ${docPath}`);

    // ✅ Ajout automatique du résumé pour Billy :
    await copySleepSummaryToBilly(date);

  } catch (e) {
    console.error('❌ Erreur analyse/upload Firestore :', e);
  }
};
