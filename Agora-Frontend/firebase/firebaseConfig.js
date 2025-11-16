import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyChUWVaTBKn0MBt2gRSuX5dUeoDY7hJhdM",
    authDomain: "agoraapp-e84de.firebaseapp.com",
    projectId: "agoraapp-e84de",
    storageBucket: "agoraapp-e84de.firebasestorage.app",
    messagingSenderId: "1077670058033",
    appId: "1:1077670058033:web:184aead7f62dacccd5dd10",
    measurementId: "G-E7YR26YX9Y"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
