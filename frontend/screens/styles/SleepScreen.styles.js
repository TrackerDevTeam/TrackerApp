import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 0,
    },
    content: {
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    sleepInfo: {
        fontSize: 16,
        marginVertical: 5,
    },
    sleepGraph: {
        flexDirection: 'row',
        width: '100%',
        height: 100,  // Augmenter la hauteur pour que les barres soient bien visibles
        marginTop: 20,
        justifyContent: 'flex-start',
    },
    graphBar: {
        height: '100%',
        borderRadius: 5,
        minWidth: 5,  // Pour éviter les barres trop fines si durée très courte
    },    
    summary: {
        fontSize: 16,
        marginVertical: 5,
    },
});
