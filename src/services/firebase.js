import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBggWcwCOIJMQP_XNSJKqIah5BeLhGnIwU",
  authDomain: "khubzy-51aa8.firebaseapp.com",
  projectId: "khubzy-51aa8",
  storageBucket: "khubzy-51aa8.firebasestorage.app",
  messagingSenderId: "502772812131",
  appId: "1:502772812131:web:d5caaca00cd61e0ba6ab56",
  measurementId: "G-KNV4FQQTG4"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
