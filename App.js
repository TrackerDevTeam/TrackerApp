import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Navigation from './frontend/navigation/Navigation';
import { collection, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from './firebaseConfig';
import { UserProvider } from './UserContext';

const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [userId, setUserId] = useState("test_user");
  const [date, setDate] = useState("");

  useEffect(() => {
    const initializeApp = async () => {
      await checkAndCreateUser(userId);
      await checkAndCreateCollectionForToday(userId);
      setIsInitialized(true);
    };

    initializeApp();
  }, [userId]);

  const checkAndCreateUser = async (userId) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDocSnapshot = await getDoc(userDocRef);
      if (!userDocSnapshot.exists()) {
        console.log("L'utilisateur n'existe pas. Création en cours...");
        await setDoc(userDocRef, {
          createdAt: new Date().toISOString()
        });
        console.log("Utilisateur créé :", userId);
      } else {
        console.log("L'utilisateur existe déjà.");
      }
    } catch (error) {
      console.error("Erreur lors de la vérification ou de la création de l'utilisateur :", error);
    }
  };

  const checkAndCreateCollectionForToday = async (userId) => {
    try {
      const today = new Date();
      const dateString = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
      setDate(dateString); // Mettre à jour la date dans le contexte

      const dateCollectionRef = collection(db, `users/${userId}/${dateString}`);
      const querySnapshot = await getDocs(dateCollectionRef);
      if (querySnapshot.empty) {
        console.log("La collection pour la date du jour n'existe pas. Création en cours...");
        const documentsToAdd = ['training', 'sante', 'sommeil', 'nutrition'];
        for (const docName of documentsToAdd) {
          const docRef = doc(dateCollectionRef, docName);
          await setDoc(docRef, {
            createdAt: new Date().toISOString()
          });
        }
        console.log("Collection créée pour la date :", dateString);
      } else {
        console.log("La collection pour la date du jour existe déjà.");
      }
    } catch (error) {
      console.error("Erreur lors de la vérification ou de la création de la collection :", error);
    }
  };

  return (
      <UserProvider value={{ userId, date }}>
        <View style={styles.container}>
          {!isInitialized ? (
              <Text>Initialisation en cours...</Text>
          ) : (
              <Navigation />
          )}
        </View>
      </UserProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
