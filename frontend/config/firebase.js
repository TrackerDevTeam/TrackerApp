import firebase from 'firebase/app';
import 'firebase/database';

const firebaseConfig = {
  // Ajoutez vos clés Firebase ici
  apiKey: 'votre-api-key',
  authDomain: 'votre-auth-domain',
  projectId: 'votre-project-id',
  storageBucket: 'votre-storage-bucket',
  messagingSenderId: 'votre-sender-id',
  appId: 'votre-app-id',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
