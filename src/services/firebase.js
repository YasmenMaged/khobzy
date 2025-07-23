// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
   apiKey: "AIzaSyAJ5OfVte7H6mtQMdlVUszXRgSiwmqMlmo",
  authDomain: "khobzak-93604.firebaseapp.com",
  projectId: "khobzak-93604",
  storageBucket: "khobzak-93604.firebasestorage.app",
  messagingSenderId: "826985498062",
  appId: "1:826985498062:web:7dee5146adf8e780fb179f",
  measurementId: "G-G2XHH6XSF6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db };
export { auth };
