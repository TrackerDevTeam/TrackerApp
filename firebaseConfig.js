import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDxFMhSycX9KFO6KdZ1F7enoeh-w-sVst8",
    authDomain: "trackerapp-98243.firebaseapp.com",
    projectId: "trackerapp-98243",
    storageBucket: "trackerapp-98243.firebasestorage.app",
    messagingSenderId: "225988291504",
    appId: "1:225988291504:web:bd2d0f8ac84cd1fe164475",
    measurementId: "G-S3HENXL02S"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
