// performanceService.js
import { db } from './firebaseConfig'; // Importation de la config Firebase
import { collection, addDoc, getDocs } from 'firebase/firestore';

// Fonction pour sauvegarder une performance dans Firestore
const savePerformance = async (performanceData) => {
    try {
        await addDoc(collection(db, "performances"), performanceData);
        console.log("✅ Performance sauvegardée dans Firestore !");
    } catch (error) {
        console.error("❌ Erreur lors de la sauvegarde de la performance :", error);
    }
};

// Fonction pour récupérer toutes les performances depuis Firestore
const getPerformances = async () => {
    const querySnapshot = await getDocs(collection(db, "performances"));
    const performances = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    return performances;
};

export { savePerformance, getPerformances };
