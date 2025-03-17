import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Modal,
    TextInput,
    Alert,
    ScrollView
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/common/Header';
import styles from './styles/WorkoutScreen.styles';

const WorkoutScreen = () => {
    // États pour gérer les données et l'interface
    const [sessions, setSessions] = useState([]);
    const [currentSession, setCurrentSession] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [exerciseHistory, setExerciseHistory] = useState({});

    // États pour les modales
    const [sessionModalVisible, setSessionModalVisible] = useState(false);
    const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
    const [performanceModalVisible, setPerformanceModalVisible] = useState(false);
    const [historyModalVisible, setHistoryModalVisible] = useState(false);

    // États pour les inputs
    const [newSessionName, setNewSessionName] = useState('');
    const [newExerciseName, setNewExerciseName] = useState('');
    const [performanceData, setPerformanceData] = useState({
        weight: '',
        sets: '',
        reps: '',
        notes: ''
    });

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
            const date = new Date().toISOString();
            const newPerformance = {
                id: Date.now().toString(),
                exerciseId: selectedExercise.id,
                weight: parseFloat(performanceData.weight),
                sets: parseInt(performanceData.sets, 10),
                reps: parseInt(performanceData.reps, 10),
                notes: performanceData.notes,
                date: date
            };

            const exerciseKey = selectedExercise.id;
            let updatedHistory = {...exerciseHistory};

            if (!updatedHistory[exerciseKey]) {
                updatedHistory[exerciseKey] = [];
            }

            updatedHistory[exerciseKey] = [
                newPerformance,
                ...updatedHistory[exerciseKey]
            ];

            await AsyncStorage.setItem('exercise_history', JSON.stringify(updatedHistory));
            setExerciseHistory(updatedHistory);
            setPerformanceModalVisible(false);
            setPerformanceData({weight: '', sets: '', reps: '', notes: ''});
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de la performance:', error);
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
            const updatedHistory = {...exerciseHistory};
            delete updatedHistory[exerciseId];
            await AsyncStorage.setItem('exercise_history', JSON.stringify(updatedHistory));
            setExerciseHistory(updatedHistory);
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'exercice:', error);
        }
    };

    const clearHistory = async () => {
        Alert.alert(
            "Confirmer la suppression",
            "Êtes-vous sûr de vouloir supprimer tout l'historique des performances ?",
            [
                {text: "Annuler", style: "cancel"},
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem('exercise_history');
                            setExerciseHistory({});
                        } catch (error) {
                            console.error('Erreur lors de la suppression de l\'historique:', error);
                        }
                    }
                }
            ]
        );
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
        setSelectedExercise(exercise);
        setPerformanceModalVisible(true);
    };

    const openExerciseHistory = (exercise) => {
        setSelectedExercise(exercise);
        setHistoryModalVisible(true);
    };

    // Affichage
    return (
        <View style={styles.container}>
            <Header title={currentSession ? currentSession.name : "Workout"}/>

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
                                <Ionicons name="add-circle" size={24} color="#4CAF50"/>
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
                                renderItem={({item}) => (
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
                                            <Ionicons name="trash-outline" size={20} color="#FF5252"/>
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
                                <Ionicons name="arrow-back" size={24} color="#333"/>
                            </TouchableOpacity>
                            <Text style={styles.sectionTitle}>Exercices</Text>
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => setExerciseModalVisible(true)}>
                                <Ionicons name="add-circle" size={24} color="#4CAF50"/>
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
                                renderItem={({item}) => {
                                    const lastPerformance = getLastPerformance(item.id);
                                    return (
                                        <View style={styles.exerciseItem}>
                                            <TouchableOpacity
                                                style={styles.exerciseInfo}
                                                onPress={() => openExerciseDetail(item)}>
                                                <Text style={styles.exerciseName}>{item.name}</Text>
                                                {lastPerformance && (
                                                    <Text style={styles.lastPerformance}>
                                                        {`Dernière perf: ${lastPerformance.weight}kg × ${lastPerformance.sets} × ${lastPerformance.reps}`}
                                                    </Text>
                                                )}
                                            </TouchableOpacity>
                                            <View style={styles.exerciseActions}>
                                                <TouchableOpacity
                                                    style={styles.historyButton}
                                                    onPress={() => openExerciseHistory(item)}>
                                                    <Ionicons name="time-outline" size={20} color="#2196F3"/>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={styles.deleteButton}
                                                    onPress={() => deleteExercise(item.id)}>
                                                    <Ionicons name="trash-outline" size={20} color="#FF5252"/>
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
                            onPress={clearHistory}>
                            <Text style={styles.clearHistoryText}>Vider l'historique</Text>
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
                            {selectedExercise ? selectedExercise.name : "Performance"}
                        </Text>

                        <Text style={styles.inputLabel}>Poids (kg)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: 60"
                            keyboardType="numeric"
                            value={performanceData.weight}
                            onChangeText={(text) => setPerformanceData({...performanceData, weight: text})}
                        />

                        <Text style={styles.inputLabel}>Séries</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: 3"
                            keyboardType="numeric"
                            value={performanceData.sets}
                            onChangeText={(text) => setPerformanceData({...performanceData, sets: text})}
                        />

                        <Text style={styles.inputLabel}>Répétitions</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: 10"
                            keyboardType="numeric"
                            value={performanceData.reps}
                            onChangeText={(text) => setPerformanceData({...performanceData, reps: text})}
                        />

                        <Text style={styles.inputLabel}>Notes (optionnel)</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Ex: Augmenter le poids la prochaine fois"
                            multiline={true}
                            numberOfLines={3}
                            value={performanceData.notes}
                            onChangeText={(text) => setPerformanceData({...performanceData, notes: text})}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => {
                                    setPerformanceModalVisible(false);
                                    setPerformanceData({weight: '', sets: '', reps: '', notes: ''});
                                }}>
                                <Text style={styles.cancelButtonText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={() => {
                                    if (performanceData.weight && performanceData.sets && performanceData.reps) {
                                        savePerformance();
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
                                <Ionicons name="close" size={24} color="#333"/>
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
                                renderItem={({item}) => (
                                    <View style={styles.historyItem}>
                                        <View style={styles.historyHeader}>
                                            <Text style={styles.historyDate}>
                                                {new Date(item.date).toLocaleDateString()} à {new Date(item.date).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                            </Text>
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
                                        </View>
                                        {item.notes && (
                                            <View style={styles.historyNotes}>
                                                <Text style={styles.historyNotesLabel}>Notes:</Text>
                                                <Text style={styles.historyNotesText}>{item.notes}</Text>
                                            </View>
                                        )}
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