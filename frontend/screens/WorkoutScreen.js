import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Modal,
    TextInput,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/common/Header';
import styles from './styles/WorkoutScreen.styles';
import { db } from '../../firebaseConfig'; // Assurez-vous que le chemin est correct
import { doc, setDoc } from "firebase/firestore";
import { UserContext } from '../../UserContext';

const LOCAL_TRAINING_KEY = 'localTrainingData';

const WorkoutScreen = () => {
    const { userId, date } = useContext(UserContext);
    const [sessionModalVisible, setSessionModalVisible] = useState(false);
    const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
    const [performanceModalVisible, setPerformanceModalVisible] = useState(false);
    const [historyModalVisible, setHistoryModalVisible] = useState(false);
    const [newSessionName, setNewSessionName] = useState('');
    const [newExerciseName, setNewExerciseName] = useState('');
    const [performanceData, setPerformanceData] = useState({ weight: '', sets: '', reps: '', rest_time: '' });
    const [sessions, setSessions] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [currentSession, setCurrentSession] = useState(null);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [exerciseHistory, setExerciseHistory] = useState({});
    const [isTrainingDocumentCreated, setIsTrainingDocumentCreated] = useState(false);
    const [editingPerformance, setEditingPerformance] = useState(null);

    // Chargement des données au démarrage
    useEffect(() => {
        loadSessions();
    }, []);

    // Chargement des exercices lorsqu'une session est sélectionnée
    useEffect(() => {
        if (currentSession) {
            loadExercises(currentSession.id);
            loadAllExerciseHistory();
        }
    }, [currentSession]);

    // Fonctions pour la gestion des données avec AsyncStorage
    const loadSessions = async () => {
        try {
            const storedSessions = await AsyncStorage.getItem('workout_sessions');
            if (storedSessions) {
                setSessions(JSON.parse(storedSessions));
            }
            // Supprimer le dossier training local au démarrage
            await deleteTrainingDocumentLocally();
            setIsTrainingDocumentCreated(false); // Le dossier n'existe plus
        } catch (error) {
            console.error('Erreur lors du chargement des séances:', error);
        }
    };

    const loadExercises = async (sessionId) => {
        try {
            const storedExercises = await AsyncStorage.getItem(`exercises_${sessionId}`);
            if (storedExercises) {
                setExercises(JSON.parse(storedExercises));
            } else {
                setExercises([]);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des exercices:', error);
        }
    };

    const deletePerformance = async (performanceId) => {
        if (!selectedExercise) return;

        try {
            // Mettre à jour l'historique
            const exerciseKey = selectedExercise.id;
            let updatedHistory = { ...exerciseHistory };

            if (updatedHistory[exerciseKey]) {
                updatedHistory[exerciseKey] = updatedHistory[exerciseKey].filter(
                    (entry) => entry.id !== performanceId
                );
                await AsyncStorage.setItem('exercise_history', JSON.stringify(updatedHistory));
                setExerciseHistory(updatedHistory);
            }

            // Mettre à jour le dossier training local
            let localTrainingData = await getTrainingLocally();
            if (localTrainingData && localTrainingData.exercices) {
                localTrainingData.exercices = localTrainingData.exercices.filter(
                    (entry) => entry.id !== performanceId
                );
                await saveTrainingLocally(localTrainingData);
                console.log("Performance supprimée du dossier training local avec succès !");
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de la performance:', error);
        }
    };

    const loadAllExerciseHistory = async () => {
        try {
            const historyData = await AsyncStorage.getItem('exercise_history');
            if (historyData) {
                setExerciseHistory(JSON.parse(historyData));
            }
        } catch (error) {
            console.error('Erreur lors du chargement de l\'historique:', error);
        }
    };

    const saveSession = async (sessionName) => {
        try {
            const newSession = {
                id: Date.now().toString(),
                name: sessionName,
                createdAt: new Date().toISOString()
            };
            const updatedSessions = [...sessions, newSession];
            await AsyncStorage.setItem('workout_sessions', JSON.stringify(updatedSessions));
            setSessions(updatedSessions);
            setSessionModalVisible(false);
            setNewSessionName('');
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de la séance:', error);
        }
    };

    const saveExercise = async () => {
        if (!currentSession) return;

        try {
            const newExercise = {
                id: Date.now().toString(),
                name: newExerciseName,
                sessionId: currentSession.id,
                createdAt: new Date().toISOString()
            };
            const updatedExercises = [...exercises, newExercise];
            await AsyncStorage.setItem(`exercises_${currentSession.id}`, JSON.stringify(updatedExercises));
            setExercises(updatedExercises);
            setExerciseModalVisible(false);
            setNewExerciseName('');
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de l\'exercice:', error);
        }
    };

    const savePerformance = async () => {
        if (!selectedExercise) return;

        try {
            const date = editingPerformance ? editingPerformance.date : new Date().toISOString(); // Garder la date originale si édition
            const newPerformance = {
                id: editingPerformance ? editingPerformance.id : Date.now().toString(), // Garder l'ID si édition
                exerciseId: selectedExercise.id,
                weight: parseInt(performanceData.weight, 10),
                sets: parseInt(performanceData.sets, 10),
                reps: parseInt(performanceData.reps, 10),
                rest_time: parseInt(performanceData.rest_time, 10),
                date: date,
            };

            const exerciseKey = selectedExercise.id;
            let updatedHistory = { ...exerciseHistory };

            if (!updatedHistory[exerciseKey]) {
                updatedHistory[exerciseKey] = [];
            }

            if (editingPerformance) {
                // Si on édite, remplacer l'entrée existante
                updatedHistory[exerciseKey] = updatedHistory[exerciseKey].map((entry) =>
                    entry.id === editingPerformance.id ? newPerformance : entry
                );
            } else {
                // Sinon, ajouter une nouvelle entrée
                updatedHistory[exerciseKey] = [
                    newPerformance,
                    ...updatedHistory[exerciseKey],
                ];
            }

            await AsyncStorage.setItem('exercise_history', JSON.stringify(updatedHistory));
            setExerciseHistory(updatedHistory);
            setPerformanceModalVisible(false);
            setPerformanceData({ weight: '', sets: '', reps: '', rest_time: '' });
            setEditingPerformance(null); // Réinitialiser l'état d'édition
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de la performance:', error);
        }
    };

    const deleteTrainingDocumentLocally = async () => {
        try {
            const trainingData = await getTrainingLocally();

            if (trainingData) {
                await AsyncStorage.removeItem(LOCAL_TRAINING_KEY);
                // Vérification explicite après suppression
                const checkData = await getTrainingLocally();
                if (!checkData) {
                    console.log("Document training supprimé localement avec succès !");
                } else {
                    console.warn("Le document n’a pas été correctement supprimé !");
                }
            } else {
                console.log("Aucun document training trouvé localement à supprimer.");
            }
        } catch (error) {
            console.error("Erreur lors de la suppression du document training localement :", error);
        }
    };

    const createTrainingDocumentLocally = async () => {
        try {
            const trainingData = await getTrainingLocally();

            if (!trainingData) {
                const defaultTrainingData = {
                    debut: new Date().toISOString(), // Renseigner l'heure de début
                    fin: "",
                    temps_depuis_derniere_seance: "",
                    duree_minutes: "",
                    nombre_series_total: "",
                    nombre_reps_total: "",
                    tonnage_total: "",
                    poids_moyen_par_serie: "",
/*                    santé_seance: {
                        frequence_cardiaque: { moyenne: "", max: "", avant: "", après: "" },
                        saturation_oxygene: { moyenne: "", min: "", max: "" },
                        temperature_corporelle: { avant: "", moyenne: "", après: "" }
                    },*/
                    exercices: []
                };

                await saveTrainingLocally(defaultTrainingData);
                console.log("Document training créé localement avec succès !");
            } else {
                console.log("Le document training existe déjà localement.");
            }
        } catch (error) {
            console.error("Erreur lors de la création du document training localement:", error);
        }
    };

    const handleSessionToggle = async () => {
        if (isTrainingDocumentCreated) {
            // Fin de séance : calculer les données, mettre à jour, synchroniser, puis supprimer
            let localTrainingData = await getTrainingLocally();
            if (localTrainingData) {
                // Renseigner l'heure de fin
                const fin = new Date().toISOString();
                localTrainingData.fin = fin;

                // Calculer la durée de la séance en minutes
                const debutDate = new Date(localTrainingData.debut);
                const finDate = new Date(fin);
                const dureeMs = finDate - debutDate; // Différence en millisecondes
                const dureeMinutes = Math.round(dureeMs / (1000 * 60)); // Convertir en minutes
                localTrainingData.duree_minutes = dureeMinutes.toString();

                // Calculer les totaux à partir des exercices
                let nombreSeriesTotal = 0;
                let nombreRepsTotal = 0;
                let tonnageTotal = 0;

                localTrainingData.exercices.forEach((exercice) => {
                    const sets = parseInt(exercice.sets, 10);
                    const reps = parseInt(exercice.reps, 10);
                    const poids = parseInt(exercice.poids, 10);

                    nombreSeriesTotal += sets;
                    nombreRepsTotal += sets * reps;
                    tonnageTotal += exercice.tonnage; // tonnage = poids × sets × reps (déjà calculé)
                });

                localTrainingData.nombre_series_total = nombreSeriesTotal.toString();
                localTrainingData.nombre_reps_total = nombreRepsTotal.toString();
                localTrainingData.tonnage_total = tonnageTotal.toString();

                // Calculer le poids moyen par série
                const poidsMoyenParSerie = nombreSeriesTotal > 0 ? tonnageTotal / nombreSeriesTotal : 0;
                localTrainingData.poids_moyen_par_serie = poidsMoyenParSerie.toFixed(2); // Arrondir à 2 décimales

                // Sauvegarder les modifications localement avant synchronisation
                await saveTrainingLocally(localTrainingData);

                // Synchroniser avec Firebase
                await syncTrainingWithFirebase();

                // Supprimer le dossier local
                await deleteTrainingDocumentLocally();
            }
            setIsTrainingDocumentCreated(false);
        } else {
            // Début de séance : créer le dossier training local
            await createTrainingDocumentLocally();
            setIsTrainingDocumentCreated(true);
        }
    };

    const saveTrainingLocally = async (trainingData) => {
        try {
            await AsyncStorage.setItem(LOCAL_TRAINING_KEY, JSON.stringify(trainingData));
            console.log("Données d'entraînement sauvegardées localement.");
        } catch (error) {
            console.error("Erreur lors de la sauvegarde locale des données d'entraînement:", error);
        }
    };

    const getTrainingLocally = async () => {
        try {
            const trainingData = await AsyncStorage.getItem(LOCAL_TRAINING_KEY);
            return trainingData ? JSON.parse(trainingData) : null;
        } catch (error) {
            console.error("Erreur lors de la récupération des données d'entraînement locales:", error);
            return null;
        }
    };

    const saveDetailedPerformance = async () => {
        if (!selectedExercise) return;

        try {
            const dateTime = editingPerformance ? editingPerformance.date : new Date().toISOString();
            const weight = parseInt(performanceData.weight, 10);
            const sets = parseInt(performanceData.sets, 10);
            const reps = parseInt(performanceData.reps, 10);
            const rest_time = parseInt(performanceData.rest_time, 10);
            const tonnage = weight * sets * reps;

            const updatedExercise = {
                nom: selectedExercise.name,
                poids: weight,
                reps: reps,
                sets: sets,
                temps_repos: rest_time,
                tonnage: tonnage,
                heure: dateTime,
                id: editingPerformance ? editingPerformance.id : Date.now().toString(), // Ajouter un ID pour identifier l'entrée
            };

            let localTrainingData = await getTrainingLocally() || { exercices: [] };

            if (editingPerformance) {
                // Si on édite, remplacer l'entrée existante
                localTrainingData.exercices = localTrainingData.exercices.map((entry) =>
                    entry.id === editingPerformance.id ? updatedExercise : entry
                );
            } else {
                // Sinon, ajouter une nouvelle entrée
                localTrainingData.exercices.push(updatedExercise);
            }

            await saveTrainingLocally(localTrainingData);
            console.log("Exercice mis à jour avec succès localement !");
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'exercice localement:", error);
        }
    };

    const syncTrainingWithFirebase = async () => {
        try {
            const localTrainingData = await getTrainingLocally();

            if (localTrainingData) {
                const trainingRef = doc(db, `users/${userId}/${date}`, "training");
                await setDoc(trainingRef, localTrainingData);
                console.log("Données d'entraînement synchronisées avec Firebase.");
            } else {
                console.log("Aucune donnée locale à synchroniser.");
            }
        } catch (error) {
            console.error("Erreur lors de la synchronisation des données d'entraînement:", error);
        }
    };

    const deleteSession = async (sessionId) => {
        try {
            const updatedSessions = sessions.filter(session => session.id !== sessionId);
            await AsyncStorage.setItem('workout_sessions', JSON.stringify(updatedSessions));
            setSessions(updatedSessions);

            // Supprimer les exercices associés
            await AsyncStorage.removeItem(`exercises_${sessionId}`);

            // Si c'est la session courante, réinitialiser
            if (currentSession && currentSession.id === sessionId) {
                setCurrentSession(null);
                setExercises([]);
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de la séance:', error);
        }
    };

    const deleteExercise = async (exerciseId) => {
        if (!currentSession) return;

        try {
            const updatedExercises = exercises.filter(exercise => exercise.id !== exerciseId);
            await AsyncStorage.setItem(`exercises_${currentSession.id}`, JSON.stringify(updatedExercises));
            setExercises(updatedExercises);

            // Supprimer l'historique associé
            const updatedHistory = { ...exerciseHistory };
            delete updatedHistory[exerciseId];
            await AsyncStorage.setItem('exercise_history', JSON.stringify(updatedHistory));
            setExerciseHistory(updatedHistory);
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'exercice:', error);
        }
    };
    const getLastPerformance = (exerciseId) => {
        if (!exerciseHistory[exerciseId] || exerciseHistory[exerciseId].length === 0) {
            return null;
        }
        return exerciseHistory[exerciseId][0];
    };

    // Fonctions pour la navigation
    const openSession = (session) => {
        setCurrentSession(session);
    };

    const backToSessions = () => {
        setCurrentSession(null);
    };

    const openExerciseDetail = (exercise) => {
        if (!isTrainingDocumentCreated) {
            Alert.alert(
                "Séance non démarrée",
                "Veuillez démarrer la séance pour ajouter une performance.",
                [{ text: "OK", style: "cancel" }]
            );
            return;
        }
        setSelectedExercise(exercise);
        setPerformanceModalVisible(true);
    };

    const openExerciseHistory = (exercise) => {
        setSelectedExercise(exercise);
        setHistoryModalVisible(true);
    };

    return (
        <View style={styles.container}>
            {/* Utilisation du CustomHeader au lieu du Header de base */}
            <Header
                title={currentSession ? currentSession.name : 'Workout'}
                leftAction={createTrainingDocumentLocally} // Action pour le bouton à gauche
                showLeftButton={true} // Masquer le bouton à droite
            />

            {/* Vue principale */}
            <View style={styles.content}>
                {!currentSession ? (
                    // Liste des séances
                    <>
                        <View style={styles.headerContainer}>
                            <Text style={styles.sectionTitle}>Vos séances d'entraînement</Text>
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => setSessionModalVisible(true)}>
                                <Ionicons name="add-circle" size={24} color="#4CAF50" />
                            </TouchableOpacity>
                        </View>

                        {sessions.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyStateText}>
                                    Vous n'avez pas encore de séance d'entraînement.
                                </Text>
                                <Text style={styles.emptyStateSubText}>
                                    Appuyez sur le bouton "+" pour créer votre première séance.
                                </Text>
                            </View>
                        ) : (
                            <FlatList
                                data={sessions}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.sessionItem}
                                        onPress={() => openSession(item)}>
                                        <View style={styles.sessionInfo}>
                                            <Text style={styles.sessionName}>{item.name}</Text>
                                            <Text style={styles.sessionDate}>
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            style={styles.deleteButton}
                                            onPress={() => deleteSession(item.id)}>
                                            <Ionicons name="trash-outline" size={20} color="#FF5252" />
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                )}
                                showsVerticalScrollIndicator={false}
                            />
                        )}
                    </>
                ) : (
                    // Vue des exercices d'une séance
                    <>
                        <View style={styles.headerContainer}>
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={backToSessions}>
                                <Ionicons name="arrow-back" size={24} color="#333" />
                            </TouchableOpacity>
                            <Text style={styles.sectionTitle}>Exercices</Text>
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => setExerciseModalVisible(true)}>
                                <Ionicons name="add-circle" size={24} color="#4CAF50" />
                            </TouchableOpacity>
                        </View>

                        {exercises.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyStateText}>
                                    Vous n'avez pas encore d'exercices dans cette séance.
                                </Text>
                                <Text style={styles.emptyStateSubText}>
                                    Appuyez sur le bouton "+" pour ajouter votre premier exercice.
                                </Text>
                            </View>
                        ) : (
                            <FlatList
                                data={exercises}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => {
                                    const lastPerformance = getLastPerformance(item.id);
                                    return (
                                        <View style={styles.exerciseItem}>
                                            <TouchableOpacity
                                                style={styles.exerciseInfo}
                                                onPress={() => openExerciseDetail(item)}>
                                                <Text style={styles.exerciseName}>{item.name}</Text>
                                                {lastPerformance && (
                                                    <Text style={styles.lastPerformance}>
                                                        {`Dernière perf: ${lastPerformance.weight}kg × ${lastPerformance.sets} × ${lastPerformance.reps}× ${lastPerformance.rest_time}s`}
                                                    </Text>
                                                )}
                                            </TouchableOpacity>
                                            <View style={styles.exerciseActions}>
                                                <TouchableOpacity
                                                    style={styles.historyButton}
                                                    onPress={() => openExerciseHistory(item)}>
                                                    <Ionicons name="time-outline" size={20} color="#2196F3" />
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={styles.deleteButton}
                                                    onPress={() => deleteExercise(item.id)}>
                                                    <Ionicons name="trash-outline" size={20} color="#FF5252" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    );
                                }}
                                showsVerticalScrollIndicator={false}
                            />
                        )}

                        <TouchableOpacity
                            style={styles.clearHistoryButton}
                            onPress={handleSessionToggle}>
                            <Text style={styles.clearHistoryText}>
                                {isTrainingDocumentCreated ? "Fin de séance" : "Début de séance"}
                            </Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>

            {/* Modal pour créer une nouvelle séance */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={sessionModalVisible}
                onRequestClose={() => setSessionModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Nouvelle séance</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nom de la séance"
                            value={newSessionName}
                            onChangeText={setNewSessionName}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => {
                                    setSessionModalVisible(false);
                                    setNewSessionName('');
                                }}>
                                <Text style={styles.cancelButtonText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={() => {
                                    if (newSessionName.trim()) {
                                        saveSession(newSessionName.trim());
                                    }
                                }}>
                                <Text style={styles.saveButtonText}>Créer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal pour ajouter un nouvel exercice */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={exerciseModalVisible}
                onRequestClose={() => setExerciseModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Nouvel exercice</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nom de l'exercice"
                            value={newExerciseName}
                            onChangeText={setNewExerciseName}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => {
                                    setExerciseModalVisible(false);
                                    setNewExerciseName('');
                                }}>
                                <Text style={styles.cancelButtonText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={() => {
                                    if (newExerciseName.trim()) {
                                        saveExercise();
                                    }
                                }}>
                                <Text style={styles.saveButtonText}>Ajouter</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal pour ajouter une performance */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={performanceModalVisible && selectedExercise !== null}
                onRequestClose={() => setPerformanceModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {selectedExercise
                                ? `${editingPerformance ? "Éditer" : "Ajouter"} - ${selectedExercise.name}`
                                : "Performance"}
                        </Text>

                        <Text style={styles.inputLabel}>Poids (kg)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: 60"
                            keyboardType="numeric"
                            value={performanceData.weight}
                            onChangeText={(text) => setPerformanceData({ ...performanceData, weight: text })}
                        />

                        <Text style={styles.inputLabel}>Séries</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: 3"
                            keyboardType="numeric"
                            value={performanceData.sets}
                            onChangeText={(text) => setPerformanceData({ ...performanceData, sets: text })}
                        />

                        <Text style={styles.inputLabel}>Répétitions</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: 10"
                            keyboardType="numeric"
                            value={performanceData.reps}
                            onChangeText={(text) => setPerformanceData({ ...performanceData, reps: text })}
                        />

                        <Text style={styles.inputLabel}>Repos (s)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: 120"
                            keyboardType="numeric"
                            value={performanceData.rest_time}
                            onChangeText={(text) => setPerformanceData({ ...performanceData, rest_time: text })}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => {
                                    setPerformanceModalVisible(false);
                                    setPerformanceData({ weight: '', sets: '', reps: '', rest_time: '' });
                                }}>
                                <Text style={styles.cancelButtonText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={() => {
                                    if (performanceData.weight && performanceData.sets && performanceData.reps) {
                                        savePerformance();
                                        saveDetailedPerformance();
                                    } else {
                                        Alert.alert("Entrée incomplète", "Veuillez remplir les champs de poids, séries et répétitions.");
                                    }
                                }}>
                                <Text style={styles.saveButtonText}>Enregistrer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal pour afficher l'historique des performances */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={historyModalVisible && selectedExercise !== null}
                onRequestClose={() => setHistoryModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, styles.historyModalContent]}>
                        <View style={styles.historyModalHeader}>
                            <Text style={styles.modalTitle}>
                                {selectedExercise ? `Historique - ${selectedExercise.name}` : "Historique"}
                            </Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setHistoryModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        {selectedExercise && (!exerciseHistory[selectedExercise.id] || exerciseHistory[selectedExercise.id].length === 0) ? (
                            <View style={styles.emptyHistoryState}>
                                <Text style={styles.emptyStateText}>
                                    Aucune performance enregistrée pour cet exercice.
                                </Text>
                            </View>
                        ) : selectedExercise && (
                            <FlatList
                                data={exerciseHistory[selectedExercise.id]}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <View style={styles.historyItem}>
                                        <View style={styles.historyHeader}>
                                            <Text style={styles.historyDate}>
                                                {new Date(item.date).toLocaleDateString()} à {new Date(item.date).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                            </Text>
                                            <View style={{ flexDirection: 'row' }}>
                                                <TouchableOpacity
                                                    style={styles.editButton}
                                                    onPress={() => {
                                                        setEditingPerformance(item);
                                                        setPerformanceData({
                                                            weight: item.weight.toString(),
                                                            sets: item.sets.toString(),
                                                            reps: item.reps.toString(),
                                                            rest_time: item.rest_time.toString(),
                                                        });
                                                        setPerformanceModalVisible(true);
                                                        setHistoryModalVisible(false);
                                                    }}>
                                                    <Ionicons name="pencil-outline" size={20} color="#2196F3" />
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={styles.deleteButton}
                                                    onPress={() => {
                                                        Alert.alert(
                                                            "Confirmer la suppression",
                                                            "Êtes-vous sûr de vouloir supprimer cette performance ?",
                                                            [
                                                                { text: "Annuler", style: "cancel" },
                                                                {
                                                                    text: "Supprimer",
                                                                    style: "destructive",
                                                                    onPress: () => deletePerformance(item.id),
                                                                },
                                                            ]
                                                        );
                                                    }}>
                                                    <Ionicons name="trash-outline" size={20} color="#FF5252" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View style={styles.historyDetails}>
                                            <View style={styles.historyDetail}>
                                                <Text style={styles.historyDetailLabel}>Poids</Text>
                                                <Text style={styles.historyDetailValue}>{item.weight} kg</Text>
                                            </View>
                                            <View style={styles.historyDetail}>
                                                <Text style={styles.historyDetailLabel}>Séries</Text>
                                                <Text style={styles.historyDetailValue}>{item.sets}</Text>
                                            </View>
                                            <View style={styles.historyDetail}>
                                                <Text style={styles.historyDetailLabel}>Répétitions</Text>
                                                <Text style={styles.historyDetailValue}>{item.reps}</Text>
                                            </View>
                                            <View style={styles.historyDetail}>
                                                <Text style={styles.historyDetailLabel}>Repos</Text>
                                                <Text style={styles.historyDetailValue}>{item.rest_time} s</Text>
                                            </View>
                                        </View>
                                    </View>
                                )}
                                showsVerticalScrollIndicator={false}
                            />
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default WorkoutScreen;
