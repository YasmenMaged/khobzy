import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import '../styles/reservationStyle.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBreadSlice } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where, doc, updateDoc, getDoc } from 'firebase/firestore';
import { firebaseConfig } from '../services/firebase';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Reservation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(UserContext);
  const { baker } = location.state || {};
  const [days, setDays] = useState(1);
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [reservationDate, setReservationDate] = useState('');

  const calculateQuantity = () => {
    const familyMembers = userData?.family_members || 0;
    if (familyMembers <= 0) {
      setError('عدد أفراد الأسرة غير متوفر.');
      return 0;
    }
    const baseQuantity = familyMembers * 5 * days;
    const maxBread = userData?.available_bread || 50;
    if (baseQuantity > maxBread) {
      setError(`الكمية المطلوبة (${baseQuantity}) تتجاوز الحد الأقصى المتاح (${maxBread} رغيف).`);
      return maxBread;
    }
    return baseQuantity;
  };

  const checkExistingReservationForDay = async (date) => {
    if (!userData?.phone || !date) return false;
    const q = query(
      collection(db, 'reservations'),
      where('phone', '==', userData.phone),
      where('date', '==', date)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const getDateRange = () => {
    if (!reservationDate) return '';
    const start = new Date(reservationDate);
    const end = new Date(start);
    end.setDate(start.getDate() + days - 1);
    return `من ${start.toLocaleDateString('ar-EG')} إلى ${end.toLocaleDateString('ar-EG')}`;
  };

  useEffect(() => {
    setQuantity(calculateQuantity());
  }, [days, userData, baker]);

  useEffect(() => {
    if (!baker) {
      setError('لم يتم العثور على تفاصيل المخبز.');
    } else if (!userData?.phone) {
      setError('رقم الهاتف غير متوفر.');
    }
  }, [baker, userData]);

  const handleReservation = async () => {
    const maxBread = userData?.available_bread || 50;
    const today = new Date().toISOString().split('T')[0];

    if (!userData?.phone) {
      setError('يجب تسجيل الدخول أولاً.');
      toast.error('يجب تسجيل الدخول أولاً.', { position: 'top-right', autoClose: 1000 });
      return;
    }
    if (!reservationDate) {
      setError('يجب اختيار تاريخ الحجز.');
      toast.error('يجب اختيار تاريخ الحجز.', { position: 'top-right', autoClose: 1000 });
      return;
    }
    if (new Date(reservationDate) < new Date(today)) {
      setError('لا يمكن الحجز في تاريخ سابق.');
      toast.error('لا يمكن الحجز في تاريخ سابق.', { position: 'top-right', autoClose: 1000 });
      return;
    }
    if (quantity > maxBread) {
      setError(`الكمية المطلوبة (${quantity}) تتجاوز المتاح (${maxBread} رغيف).`);
      toast.error(`الكمية المطلوبة تتجاوز المتاح (${maxBread} رغيف).`, { position: 'top-right', autoClose: 2000 });
      return;
    }
    if (quantity <= 0) {
      setError('الكمية يجب أن تكون أكبر من صفر.');
      toast.error('الكمية يجب أن تكون أكبر من صفر.', { position: 'top-right', autoClose: 2000 });
      return;
    }

    const start = new Date(reservationDate);
    for (let i = 0; i < days; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];
      if (await checkExistingReservationForDay(dateStr)) {
        setError('يوجد حجز مسبق في أحد الأيام المحددة.');
        toast.error('يوجد حجز مسبق في أحد الأيام المحددة.', { position: 'top-right', autoClose: 2000 });
        return;
      }
    }

    const newAvailableBread = userData.available_bread - quantity;
    try {
      const startDate = new Date(reservationDate).toISOString().split('T')[0];
      const reservationRef = await addDoc(collection(db, 'reservations'), {
        phone: userData.phone,
        bakery_owner_national_id: baker.national_id, // استخدام national_id من baker
        date: startDate,
        quantity: quantity,
        bakery: baker.bakery_name || 'غير محدد',
        time: selectedTime,
        user: userData.name || 'غير محدد',
        days: days,
        confirmed: false,
        delivered: false,
        created_at: new Date(),
        card_id: userData.card_id,
        user_national_id: userData.national_id,
      });

      const citizenRef = doc(db, 'citizens', userData.national_id);
      const citizenDoc = await getDoc(citizenRef);
      if (!citizenDoc.exists()) {
        throw new Error('لم يتم العثور على مستند المواطن في قاعدة البيانات.');
      }
      await updateDoc(citizenRef, { available_bread: newAvailableBread });

      const updatedUserData = { ...userData, available_bread: newAvailableBread };
      setUserData(updatedUserData);
      localStorage.setItem('userData', JSON.stringify(updatedUserData));

      toast.success('تم حجز الموعد بنجاح!', { position: 'top-right', autoClose: 2000 });
      setTimeout(() => navigate('/reservation-history'), 2000);
    } catch (error) {
      console.error('Error in reservation process:', error);
      setError('فشل في حفظ الحجز. حاول مجددًا.');
      toast.error('فشل في حفظ الحجز. حاول مجددًا.', { position: 'top-right', autoClose: 2000 });
      setUserData({ ...userData });
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  };

  const timeOptions = [];
  for (let hour = 9; hour < 14; hour++) {
    for (let minute = 0; minute < 60; minute += 10) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeOptions.push(time);
    }
  }

  if (!baker) return <div style={{ color: 'red', textAlign: 'center', margin: '20px' }}>{error}</div>;

  return (
    <div className="reservation-container">
      <div className="header mt-4">
        <h1 style={{color:'#4A2C2A'}}><FontAwesomeIcon icon={faBreadSlice} style={{ color: '#D99A2B', marginRight: '10px' }}/> حجز العيش</h1>
      </div>
      <div className="reservation-card">
        <div className="info-row">
          <span>اسم المخبز:</span>
          <span>{baker.bakery_name || 'غير محدد'}</span>
        </div>
        <div className="info-row">
          <span>الموقع:</span>
          <span>{baker.location || 'غير محدد'}</span>
        </div>
        <div className="info-row">
          <span>الرغيف المتاح:</span>
          <span>{userData?.available_bread || 'غير محدد'} رغيف</span>
        </div>
        <div className="quantity-input">
          <label htmlFor="reservationDate" style={{ fontSize: '1.4rem', paddingLeft: '10px' }}>اختر التاريخ:</label>
          <input
            type="date"
            id="reservationDate"
            value={reservationDate}
            onChange={(e) => setReservationDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="custom-select"
            style={{ padding: '5px 0 5px 30px', margin: '5px 0', width:'30%' }}
          />
        </div>
        <div className="quantity-input">
          <label htmlFor="days" style={{ fontSize: '1.4rem', paddingLeft: '10px' }}>عدد الأيام:</label>
          <select
            id="days"
            value={days}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (value > 3) {
                setError('الحد الأقصى لعدد الأيام هو 3.');
              } else {
                setDays(value);
                setError('');
              }
            }}
            className="custom-select"
          >
            <option value="1">1 يوم</option>
            <option value="2">2 أيام</option>
            <option value="3">3 أيام</option>
          </select>
        </div>
        <div className="info-row">
          <span>النطاق الزمني:</span>
          <span>{getDateRange()}</span>
        </div>
        <div className="info-row">
          <span>الكمية المحجوزة:</span>
          <span>{quantity} رغيف</span>
        </div>
        <div className="quantity-input">
          <label htmlFor="time" style={{ fontSize: '1.4rem', paddingLeft: '10px' }}>اختر الوقت:</label>
          <select
            id="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="custom-select"
          >
            {timeOptions.map((time, index) => (
              <option key={index} value={time}>{time}</option>
            ))}
          </select>
        </div>
        <ToastContainer />
        <button
          className="reserve-btn"
          onClick={handleReservation}
          disabled={quantity === 0 || error}
        >
          حجز الموعد
        </button>
      </div>
    </div>
  );
};

export default Reservation;