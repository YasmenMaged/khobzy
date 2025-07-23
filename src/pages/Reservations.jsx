import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import '../styles/dashboard.css'; // استخدام نفس الأنماط

const Reservations = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      const snapshot = await getDocs(collection(db, 'reservations'));
      const reservationsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReservations(reservationsList);
    };
    fetchReservations();
  }, []);

  return (
    <div className="dashboard-grid">
      <div className="sidebar">
        <h4>خبزك</h4>
        <a href="/">الرئيسية</a>
        <a href="/dashboard">لوحة التحكم</a>
        <a href="/reservations">جدول الطلبات</a>
      </div>
      <div className="main-content">
        <h2>جدول الطلبات</h2>
        <div className="row">
          <div className="col-12">
            <div className="stat-card">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>الوقت</th>
                    <th>الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.length > 0 ? (
                    reservations.map((res, index) => (
                      <tr key={index}>
                        <td>{res.time || 'غير محدد'}</td>
                        <td>{res.status || 'غير محدد'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center">لا يوجد طلبات حالياً</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservations;