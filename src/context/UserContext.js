import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCitizenByPhone } from '../modules/registeredUsers.js'; // استيراد دالة جلب بيانات المواطن

// Create the UserContext
export const UserContext = createContext();

// Create a provider component
export const UserContextProvider = ({ children }) => {
  const [userType, setUserType] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({
    phone: '',
    family_members: 0,
    monthly_bread_quota: 0,
    available_bread_per_day: 0,
    available_bread: 0,
  });

  useEffect(() => {
    // جلب بيانات المستخدم عند التحميل الأولي أو تغيير حالة الدخول أو رقم الهاتف
    const fetchUserData = async () => {
      if (isLoggedIn && userData.phone) {
        try {
          const citizen = await getCitizenByPhone(userData.phone);
          if (citizen) {
            setUserData({
              ...userData,
              family_members: parseInt(citizen.family_members) || 0,
              monthly_bread_quota: parseInt(citizen.monthly_bread_quota) || 0,
              available_bread_per_day: parseInt(citizen.available_bread_per_day) || 0,
              available_bread: parseInt(citizen.available_bread) || 0,
            });
          } else {
            setUserData({ ...userData, family_members: 0, monthly_bread_quota: 0, available_bread_per_day: 0, available_bread: 0 });
          }
        } catch (err) {
          console.error('خطأ أثناء جلب بيانات المواطن:', err);
          setUserData({ ...userData, family_members: 0, monthly_bread_quota: 0, available_bread_per_day: 0, available_bread: 0 });
        }
      }
    };

    fetchUserData();
  }, [isLoggedIn, userData.phone]);

  // دالة مساعدة لتحديث البيانات من Firebase فورًا
  const refreshUserData = async (phone) => {
    if (phone) {
      try {
        const citizen = await getCitizenByPhone(phone);
        if (citizen) {
          setUserData({
            ...userData,
            family_members: parseInt(citizen.family_members) || 0,
            monthly_bread_quota: parseInt(citizen.monthly_bread_quota) || 0,
            available_bread_per_day: parseInt(citizen.available_bread_per_day) || 0,
            available_bread: parseInt(citizen.available_bread) || 0,
          });
        }
      } catch (err) {
        console.error('خطأ أثناء تحديث بيانات المواطن:', err);
      }
    }
  };

  return (
    <UserContext.Provider value={{ userType, setUserType, isLoggedIn, setIsLoggedIn, userData, setUserData, refreshUserData }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);