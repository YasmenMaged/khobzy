import { db } from '../services/firebase.js';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';

export const getCitizenByPhone = async (phone, password) => {
  try {
    const citizensCollection = collection(db, 'citizens');
    const citizensSnapshot = await getDocs(citizensCollection);
    const citizen = citizensSnapshot.docs
      .map(doc => doc.data())
      .find(c => c.phone === phone && c.password === password);
    return citizen || null;
  } catch (error) {
    console.error("Error fetching citizen:", error);
    return null;
  }
}; 

export async function getAllUsers() {
  try {
    const usersCol = collection(db, 'registered_users');
    const usersSnapshot = await getDocs(usersCol);
    const usersList = [];
    usersSnapshot.forEach((doc) => {
      usersList.push({ id: doc.id, ...doc.data() });
    });
    return usersList;
  } catch (error) {
    console.error('خطأ أثناء جلب جميع المستخدمين:', error);
    return [];
  }
}

export async function addUser(newUser) {
  try {
    const userRef = doc(db, 'registered_users', newUser.phone);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      await setDoc(userRef, { ...userSnap.data(), ...newUser }, { merge: true });
      return { success: true, message: 'تم تحديث البيانات بنجاح.' };
    } else {
      await setDoc(userRef, newUser);
      return { success: true, message: 'تم التسجيل بنجاح.' };
    }
  } catch (error) {
    return { success: false, message: 'فشل في تحديث/تسجيل البيانات: ' + error.message };
  }
}

export const getUser = async (phone, password) => {
  try {
    const usersCollection = collection(db, 'registered_users'); // توحيد الاسم
    const usersSnapshot = await getDocs(usersCollection);
    const user = usersSnapshot.docs
      .map(doc => doc.data())
      .find(u => u.phone.trim() === phone.trim() && u.password.trim() === password.trim()); // تنظيف البيانات
    console.log("User found:", user); // لتسجيل النتيجة
    return user || null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

// دوال جديدة للتحقق من citizen و bakers
export async function getCitizenByNationalId(nationalId) {
  try {
    const citizensCol = collection(db, 'citizen');
    const snapshot = await getDocs(citizensCol);
    let foundCitizen = null;
    snapshot.forEach((doc) => {
      if (doc.data().national_id === nationalId) {
        foundCitizen = { id: doc.id, ...doc.data() };
      }
    });
    return foundCitizen;
  } catch (error) {
    console.error('خطأ أثناء جلب المواطن:', error);
    return null;
  }
}

export async function getBakerByNationalId(nationalId) {
  try {
    const bakersCol = collection(db, 'bakers');
    const snapshot = await getDocs(bakersCol);
    let foundBaker = null;
    snapshot.forEach((doc) => {
      if (doc.data().national_id === nationalId) {
        foundBaker = { id: doc.id, ...doc.data() };
      }
    });
    return foundBaker;
  } catch (error) {
    console.error('خطأ أثناء جلب صاحب المخبز:', error);
    return null;
  }
}