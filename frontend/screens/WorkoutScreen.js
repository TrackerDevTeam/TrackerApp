import React, { useState, useEffect } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/common/Header';
import styles from './styles/WorkoutScreen.styles';

const WorkoutScreen = () => {
    // États pour gérer les données et l'interface
    const [workouts, setWorkouts] = useState([]);
    const [exercises, setExercises] = useState({});
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
    const [performanceModalVisible, setPerformanceModalVisible] = useState(false);
    const [newWorkoutName, setNewWorkoutName] = useState('');
    const [newExerciseName, setNewExerciseName] = useState('');
    const [performance, setPerformance] = useState({
        weight: '',
        reps: '',
        sets: '',
        notes: ''
    });

    // Charger les données au démarrage
    useEffect(() => {
        loadWorkoutData();
    }, []);

    // Fonction pour charger les données depuis le stockage local
    const loadWorkoutData = async () => {
        try {
            const workoutsData = await AsyncStorage.getItem('workouts');
            const exercisesData = await AsyncStorage.getItem('exercises');

            if (workoutsData) {
                setWorkouts(JSON.parse(workoutsData));
            }

            if (exercisesData) {
                setExercises(JSON.parse(exercisesData));
            }
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
        }
    };

    // Fonction pour sauvegarder les données dans le stockage local
    const saveWorkoutData = async () => {
        try {
            await AsyncStorage.setItem('workouts', JSON.stringify(workouts));
            await AsyncStorage.setItem('exercises', JSON.stringify(exercises));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des données:', error);
        }
    };

    // Fonction pour créer une nouvelle séance
    const createWorkout = () => {
        if (newWorkoutName.trim() === '') {
            Alert.alert('Erreur', 'Veuillez entrer un nom pour la séance');
            return;
        }

        const newWorkout = {
            id: Date.now().toString(),
            name: newWorkoutName,
            createdAt: new Date().toISOString(),
            exercises: []
        };

        const updatedWorkouts = [...workouts, newWorkout];
        setWorkouts(updatedWorkouts);
        setNewWorkoutName('');
        setModalVisible(false);

        // Sauvegarder les données
        setTimeout(() => saveWorkoutData(), 100);
    };

    // Fonction pour ajouter un exercice à une séance
    const addExercise = () => {
        if (newExerciseName.trim() === '') {
            Alert.alert('Erreur', 'Veuillez entrer un nom pour l\'exercice');
            return;
        }

        const exerciseId = Date.now().toString();
        const newExercise = {
            id: exerciseId,
            name: newExerciseName
        };

        // Mettre à jour la séance sélectionnée avec le nouvel exercice
        const updatedWorkouts = workouts.map(workout => {
            if (workout.id === selectedWorkout.id) {
                return {
                    ...workout,
                    exercises: [...workout.exercises, exerciseId]
                };
            }
            return workout;
        });

        // Mettre à jour les exercices
        const updatedExercises = {
            ...exercises,
            [exerciseId]: {
                ...newExercise,
                history: []
            }
        };

        setWorkouts(updatedWorkouts);
        setExercises(updatedExercises);
        setNewExerciseName('');
        setExerciseModalVisible(false);

        // Sauvegarder les données
        setTimeout(() => saveWorkoutData(), 100);
    };

    // Fonction pour enregistrer une performance
    const recordPerformance = () => {
        const newPerformance = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            weight: parseFloat(performance.weight) || 0,
            reps: parseInt(performance.reps) || 0,
            sets: parseInt(performance.sets) || 0,
            notes: performance.notes
        };

        // Mettre à jour l'historique de l'exercice
        const updatedExercises = {
            ...exercises,
            [selectedExercise.id]: {
                ...exercises[selectedExercise.id],
                history: [
                    ...exercises[selectedExercise.id].history,
                    newPerformance
                ]
            }
        };

        setExercises(updatedExercises);
        setPerformanceModalVisible(false);
        setPerformance({ weight: '', reps: '', sets: '', notes: '' });

        // Sauvegarder les données
        setTimeout(() => saveWorkoutData(), 100);
    };

    // Fonction pour supprimer l'historique d'un exercice
    const clearExerciseHistory = (exerciseId) => {
        Alert.alert(
            'Confirmation',
            'Êtes-vous sûr de vouloir supprimer tout l\'historique de cet exercice ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: () => {
                        const updatedExercises = {
                            ...exercises,
                            [exerciseId]: {
                                ...exercises[exerciseId],
                                history: []
                            }
                        };
                        setExercises(updatedExercises);
                        setTimeout(() => saveWorkoutData(), 100);
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Header title="Workout" />

            {/* Liste des séances */}
            {!selectedWorkout ? (
                <View style={styles.content}>
                    <Text style={styles.sectionTitle}>Mes séances</Text>

                    {workouts.length === 0 ? (
                        <Text style={styles.emptyText}>Aucune séance créée</Text>
                    ) : (
                        <FlatList
                            data={workouts}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.workoutCard}
                                    onPress={() => setSelectedWorkout(item)}
                                >
                                    <Text style={styles.workoutName}>{item.name}</Text>
                                    <Text style={styles.workoutDetail}>
                                        {item.exercises.length} exercice(s)
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    )}

                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => setModalVisible(true)}
                    >
                        <Ionicons name="add" size={24} color="white" />
                        <Text style={styles.addButtonText}>Créer une séance</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                // Vue détaillée d'une séance
                <View style={styles.content}>
                    <View style={styles.workoutHeader}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => setSelectedWorkout(null)}
                        >
                            <Ionicons name="arrow-back" size={24} color="#333" />
                            <Text style={styles.backButtonText}>Retour</Text>
                        </TouchableOpacity>
                        <Text style={styles.workoutTitle}>{selectedWorkout.name}</Text>
                    </View>

                    {/* Liste des exercices */}
                    {selectedWorkout.exercises.length === 0 ? (
                        <Text style={styles.emptyText}>Aucun exercice ajouté</Text>
                    ) : (
                        <FlatList
                            data={selectedWorkout.exercises}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => {
                                const exercise = exercises[item];
                                return (
                                    <TouchableOpacity
                                        style={styles.exerciseCard}
                                        onPress={() => {
                                            setSelectedExercise(exercise);
                                            setPerformanceModalVisible(true);
                                        }}
                                    >
                                        <View style={styles.exerciseInfo}>
                                            <Text style={styles.exerciseName}>{exercise?.name}</Text>
                                            <Text style={styles.exerciseDetail}>
                                                {exercise?.history?.length || 0} enregistrement(s)
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            style={styles.historyButton}
                                            onPress={() => clearExerciseHistory(exercise.id)}
                                        >
                                            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    )}

                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => setExerciseModalVisible(true)}
                    >
                        <Ionicons name="add" size={24} color="white" />
                        <Text style={styles.addButtonText}>Ajouter un exercice</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Modal pour créer une séance */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Créer une séance</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nom de la séance"
                            value={newWorkoutName}
                            onChangeText={setNewWorkoutName}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={createWorkout}
                            >
                                <Text style={styles.modalButtonText}>Créer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal pour ajouter un exercice */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={exerciseModalVisible}
                onRequestClose={() => setExerciseModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Ajouter un exercice</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nom de l'exercice"
                            value={newExerciseName}
                            onChangeText={setNewExerciseName}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setExerciseModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={addExercise}
                            >
                                <Text style={styles.modalButtonText}>Ajouter</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal pour enregistrer une performance */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={performanceModalVisible}
                onRequestClose={() => setPerformanceModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {selectedExercise?.name || "Exercice"}
                        </Text>
                        <ScrollView>
                            <TextInput
                                style={styles.input}
                                placeholder="Poids (kg)"
                                value={performance.weight}
                                onChangeText={(text) => setPerformance({...performance, weight: text})}
                                keyboardType="numeric"
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Répétitions"
                                value={performance.reps}
                                onChangeText={(text) => setPerformance({...performance, reps: text})}
                                keyboardType="numeric"
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Séries"
                                value={performance.sets}
                                onChangeText={(text) => setPerformance({...performance, sets: text})}
                                keyboardType="numeric"
                            />
                            <TextInput
                                style={[styles.input, styles.notesInput]}
                                placeholder="Notes"
                                value={performance.notes}
                                onChangeText={(text) => setPerformance({...performance, notes: text})}
                                multiline={true}
                            />
                        </ScrollView>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setPerformanceModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={recordPerformance}
                            >
                                <Text style={styles.modalButtonText}>Enregistrer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default WorkoutScreen;