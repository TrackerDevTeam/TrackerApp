import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    // Conteneurs principaux
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    content: {
        flex: 1,
        padding: 16
    },

    // En-têtes et titres
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    addButton: {
        padding: 5,
    },
    backButton: {
        padding: 5,
    },

    // États vides
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    emptyStateText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    emptyStateSubText: {
        fontSize: 14,
        textAlign: 'center',
        color: '#666',
    },
    emptyHistoryState: {
        padding: 20,
        alignItems: 'center',
    },

    // Liste des séances
    sessionItem: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sessionInfo: {
        flex: 1,
    },
    sessionName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    sessionDate: {
        fontSize: 12,
        color: '#666',
    },

    // Liste des exercices
    exerciseItem: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    exerciseInfo: {
        flex: 1,
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    lastPerformance: {
        fontSize: 12,
        color: '#666',
    },
    exerciseActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    // Boutons d'action
    deleteButton: {
        padding: 5,
    },
    historyButton: {
        padding: 5,
        marginRight: 10,
    },
    clearHistoryButton: {
        backgroundColor: '#FF5252',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 10,
    },
    clearHistoryText: {
        color: 'white',
        fontWeight: 'bold',
    },

    // Modales
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '85%',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    historyModalContent: {
        height: '70%',
        width: '90%',
    },
    historyModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    closeButton: {
        padding: 5,
    },

    // Formulaires et inputs
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 5,
        color: '#333',
    },
    input: {
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        flex: 1,
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        marginLeft: 10,
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#f0f0f0',
        marginRight: 10,
    },
    cancelButtonText: {
        color: '#333',
    },

    // Historique des performances
    historyItem: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    historyHeader: {
        marginBottom: 8,
    },
    historyDate: {
        fontSize: 14,
        fontWeight: '500',
        color: '#2196F3',
    },
    historyDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    historyDetail: {
        alignItems: 'center',
        flex: 1,
    },
    historyDetailLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 3,
    },
    historyDetailValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    historyNotes: {
        marginTop: 8,
        padding: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    historyNotesLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 3,
    },
    historyNotesText: {
        fontSize: 14,
    }
});