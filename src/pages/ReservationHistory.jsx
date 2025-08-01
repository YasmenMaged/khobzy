import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/reservationStyle.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory } from '@fortawesome/free-solid-svg-icons';
import { useSpring, animated } from 'react-spring';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useUser } from '../context/UserContext';
import { firebaseConfig } from '../services/firebase.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ReservationHistory = () => {
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();
  const { userData } = useUser();

  useEffect(() => {
    const fetchReservations = async () => {
      if (!userData?.phone) return;
      const q = query(collection(db, 'reservations'), where('userId', '==', userData.phone));
      const querySnapshot = await getDocs(q);
      const reservationsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReservations(reservationsList);
    };
    fetchReservations();
  }, [userData]);

  const springProps = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { duration: 1000 },
  });

  return (
    <div className="reservationH-container mt-4 pt-4">
      <div className="header mt-4">
        <h1 style={{ color: '#4A2C2A' }}>
          <FontAwesomeIcon icon={faHistory} style={{ color: '#D99A2B', marginRight: '10px' }} />
          طلباتي
        </h1>
      </div>
      <div className="reservation-card" style={{
        maxWidth: '80%',
        margin: '0 auto',
        padding: '20px',
        background: 'linear-gradient(135deg, #FDFAF6 0%, #ECE1D6 100%)',
        borderRadius: '15px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
        border: '1px solid #d99a2b33',
      }}>
        {reservations.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6B4E31', fontSize: '1.2rem' }}>لا توجد حجوزات سابقة.</p>
        ) : (
          <div className="d-flex flex-wrap gy-2">
            {reservations.map((res) => (
              <animated.div
                key={res.id}
             
                className="infographic-card p-4 bg-white rounded-lg shadow-md"
                style={{springProps, maxWidth: '300px', margin: '5px auto', background: 'linear-gradient(135deg, #ffffff 0%, #f8ece4 100%)', border: '1px solid #e0b24333' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '1.8rem', color: '#6B4E31', fontFamily: 'Aref Ruqaa' }}>
                  <span style={{ color: '#D99A2B' }}>التاريخ:</span>
                  <span style={{ fontSize: '1.5rem' }}>{res.date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '1.8rem', color: '#6B4E31', fontFamily: 'Aref Ruqaa', marginTop: '10px' }}>
                  <span style={{ color: '#D99A2B' }}>عدد الرغيف:</span>
                  <span style={{ fontSize: '1.5rem' }}>{res.quantity} رغيف</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '1.8rem', color: '#6B4E31', fontFamily: 'Aref Ruqaa', marginTop: '10px' }}>
                  <span style={{ color: '#D99A2B' }}>اسم المخبز:</span>
                  <span style={{ fontSize: '1.5rem' }}>{res.bakeryName}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '1.8rem', color: '#6B4E31', fontFamily: 'Aref Ruqaa', marginTop: '10px' }}>
                  <span style={{ color: '#D99A2B' }}>الساعة:</span>
                  <span style={{ fontSize: '1.5rem' }}>{res.time}</span>
                </div>
                <div style={{ marginTop: '10px', fontSize: '1.4rem', color: res.confirmed ? '#28a745' : '#dc3545' }}>
                  {res.confirmed ? 'تم تأكيد طلبك، يمكنك التوجه للمخبز لاستلام الخبز' : 'قيد المراجعة من المخبز'}
                </div>
              </animated.div>
            ))}
          </div>
        )}
        <button
          className="reserve-btn mt-3"
          onClick={() => navigate('/')}
          style={{
            backgroundColor: '#D99A2B',
            color: '#FFFFFF',
            padding: '8px 16px',
            borderRadius: '5px',
            border: 'none',
            fontSize: '1rem',
            display: 'block',
            margin: '20px auto',
          }}
        >
          العودة إلى الصفحة الرئيسية
        </button>
      </div>
    </div>
  );
};

export default ReservationHistory;