// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJ5OfVte7H6mtQMdlVUszXRgSiwmqMlmo",
  authDomain: "khobzak-93604.firebaseapp.com",
  projectId: "khobzak-93604",
  storageBucket: "khobzak-93604.firebasestorage.app",
  messagingSenderId: "826985498062",
  appId: "1:826985498062:web:7dee5146adf8e780fb179f",
  measurementId: "G-G2XHH6XSF6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);