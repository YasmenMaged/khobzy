import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import '../styles/reservationStyle.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBreadSlice } from '@fortawesome/free-solid-svg-icons';

const Reservation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(UserContext);
  const { baker } = location.state || {};
  const [days, setDays] = useState(1);
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [quantity, setQuantity] = useState(0);

  const calculateQuantity = () => {
    const familyMembers = userData?.family_members || 0;
    if (familyMembers <= 0) {
      setError('عدد أفراد الأسرة غير متوفر.');
      return 0;
    }
    const baseQuantity = familyMembers * 5 * days;
    const maxBread = userData?.available_bread || 50; // التحقق من الرغيف المتاح من userData
    return Math.min(baseQuantity, maxBread);
  };

  useEffect(() => {
    setQuantity(calculateQuantity());
  }, [days, userData, baker]);

  useEffect(() => {
    if (!baker) {
      setError('لم يتم العثور على تفاصيل المخبز.');
    }
  }, [baker]);

  const handleReservation = () => {
    const maxBread = userData?.available_bread || 50;
    if (quantity > maxBread) {
      setError(`الكمية المطلوبة (${quantity}) تتجاوز المتاح (${maxBread} رغيف).`);
      setSuccess('');
    } else if (quantity <= 0) {
      setError('الكمية يجب أن تكون أكبر من صفر.');
      setSuccess('');
    } else {
      // تحديث الرغيف المتاح في userData
      const newAvailableBread = userData.available_bread - quantity;
      setUserData({ ...userData, available_bread: newAvailableBread });

      // إضافة الحجز إلى السجل
      const reservation = {
        date: new Date().toLocaleDateString(),
        quantity: quantity,
        bakeryName: baker.bakery_name || 'غير محدد',
        time: selectedTime,
      };
      const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
      reservations.push(reservation);
      localStorage.setItem('reservations', JSON.stringify(reservations));

      setSuccess(`تم الحجز بنجاح! ${quantity} رغيف لمدة ${days} أيام في ${selectedTime}`);
      setError('');
      setTimeout(() => navigate('/reservation-history'), 2000);
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
        <h1>حجز العيش <FontAwesomeIcon icon={faBreadSlice} /></h1>
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
          <label htmlFor="days" style={{ fontSize: '1.4rem', paddingLeft: '10px' }}>عدد الأيام:</label>
          <select
            id="days"
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            className="custom-select"
          >
            <option value="1">1 يوم</option>
            <option value="2">2 أيام</option>
            <option value="3">3 أيام</option>
          </select>
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
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <button className="reserve-btn" onClick={handleReservation}>
          تأكيد الحجز
        </button>
      </div>
    </div>
  );
};

export default Reservation;