// // firebase.js
// import { initializeApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';

// const firebaseConfig = {
//    apiKey: "AIzaSyAJ5OfVte7H6mtQMdlVUszXRgSiwmqMlmo",
//   authDomain: "khobzak-93604.firebaseapp.com",
//   projectId: "khobzak-93604",
//   storageBucket: "khobzak-93604.firebasestorage.app",
//   messagingSenderId: "826985498062",
//   appId: "1:826985498062:web:7dee5146adf8e780fb179f",
//   measurementId: "G-G2XHH6XSF6"
// };

// const app = initializeApp(firebaseConfig);


// const db = getFirestore(app);
// const auth = getAuth(app);


// export { db , auth };



//////////////////////////////



// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBggWcwCOIJMQP_XNSJKqIah5BeLhGnIwU",
  authDomain: "khubzy-51aa8.firebaseapp.com",
  projectId: "khubzy-51aa8",
  storageBucket: "khubzy-51aa8.firebasestorage.app",
  messagingSenderId: "502772812131",
  appId: "1:502772812131:web:d5caaca00cd61e0ba6ab56",
  measurementId: "G-KNV4FQQTG4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);