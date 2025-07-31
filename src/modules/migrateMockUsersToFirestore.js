import { readFile } from 'fs/promises';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Your web app's Firebase configuration
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
const db = getFirestore(app);

(async () => {
  const mockUsersRaw = await readFile(new URL('./mock_users.json', import.meta.url), 'utf8');
  const mockUsers = JSON.parse(mockUsersRaw);

  try {
    for (const citizen of mockUsers.citizens) {
      await setDoc(doc(db, "users", citizen.phone), { ...citizen, type: "citizen" });
      console.log(`Migrated citizen: ${citizen.name}`);
    }
    for (const baker of mockUsers.bakers) {
      await setDoc(doc(db, "users", baker.phone), { ...baker, type: "baker" });
      console.log(`Migrated baker: ${baker.name}`);
    }
    console.log("تم الانتهاء من الترحيل بنجاح!");
  } catch (error) {
    console.error("خطأ أثناء الترحيل:", error);
  }
})();