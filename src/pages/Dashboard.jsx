import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import mockUsers from '../modules/mock_users.json';
import { getAllUsers } from '../modules/registeredUsers';
import { useUser } from '../context/UserContext';
import '../styles/dashboard.css';
import '../styles/auth.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { firebaseConfig } from '../services/firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Dashboard = () => {
  const { userType, userData } = useUser();
  const [users, setUsers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [newOrdersCount, setNewOrdersCount] = useState(0);

  useEffect(() => {
    if (userType !== 'owner') {
      navigate('/');
      return;
    }

    const fetchUsers = async () => {
      try {
        const registeredUsers = await getAllUsers();
        const allUsers = [
          ...mockUsers.citizens,
          ...mockUsers.bakers,
          ...(Array.isArray(registeredUsers) ? registeredUsers : []),
        ];
        setUsers(allUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([...mockUsers.citizens, ...mockUsers.bakers]);
      }
    };

    const fetchReservations = async () => {
      if (!userData?.phone) return;
      const q = query(collection(db, 'reservations'), where('bakerId', '==', userData.phone));
      const querySnapshot = await getDocs(q);
      const reservationsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReservations(reservationsList);
      setNewOrdersCount(reservationsList.filter(res => !res.confirmed).length);
    };

    fetchUsers();
    fetchReservations();
  }, [userType, navigate, userData]);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  const handleConfirmReservation = async (reservationId) => {
    const reservationRef = doc(db, 'reservations', reservationId);
    await updateDoc(reservationRef, { confirmed: true });
    const updatedReservations = reservations.map(res =>
      res.id === reservationId ? { ...res, confirmed: true } : res
    );
    setReservations(updatedReservations);
    setNewOrdersCount(updatedReservations.filter(r => !r.confirmed).length);
    toast.success('تم تأكيد الطلب بنجاح!', { position: 'top-right', autoClose: 2000 });
  };

  const sidebarLinks = [
    { path: '/', text: 'نظرة عامة' },
    { path: '/orders', text: 'الطلبات', count: newOrdersCount },
    { path: '/order-history', text: 'سجل الطلبات' },
    { path: '/production', text: 'إدارة الإنتاج' },
  ];

  return (
    <div className="dashboard" style={{ display: 'flex', height: '100vh', backgroundColor: '#F5F1E8' }}>
      <div className="sidebar" style={{ width: '250px', backgroundColor: '#4A2C2A', color: '#fff', padding: '20px' }}>
        <div className="sidebar-header">
          <h5 className="sidebar-title" style={{ fontSize: '1.5rem', fontFamily: 'Aref Ruqaa' }}>لوحة التحكم</h5>
        </div>
        <ul className="sidebar-nav" style={{ listStyle: 'none', padding: 0 }}>
          {sidebarLinks.map((link) => (
            <li className="nav-item mb-2" key={link.path}>
              <Link
                className={`sidebar-link ${location.pathname === link.path ? 'active' : ''}`}
                to={link.path}
                style={{ display: 'block', color: '#fff', textDecoration: 'none', padding: '10px', fontFamily: 'Aref Ruqaa' }}
              >
                <span>{link.text}</span>
                {link.count && <span style={{ backgroundColor: '#D99A2B', borderRadius: '50%', padding: '2px 8px', marginLeft: '10px' }}>{link.count}</span>}
              </Link>
            </li>
          ))}
          <li className="nav-item mb-2">
            <button className="sidebar-link logout-btn" onClick={handleLogout} style={{ width: '100', background: 'none', border: 'none', color: '#fff', textAlign: 'left', padding: '10px', fontFamily: 'Aref Ruqaa' }}>
              تسجيل الخروج
            </button>
          </li>
        </ul>
      </div>

      <div className="main-content" style={{ flex: 1, padding: '20px', backgroundColor: '#fff', borderRadius: '15px', margin: '20px' }}>
        <h5 className="dashboard-title" style={{ color: '#4A2C2A', fontSize: '1.8rem', fontFamily: 'Aref Ruqaa' }}>لوحة التحكم</h5>
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
          <div className="stat-column" style={{ backgroundColor: '#FDFAF6', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
            <div className="column-title" style={{ color: '#6B4E31', fontSize: '1.2rem' }}>إعداد الطلبات اليوم</div>
            <div className="stat-item" style={{ fontSize: '1.5rem', color: '#D99A2B' }}>50%</div>
          </div>
          <div className="stat-column" style={{ backgroundColor: '#FDFAF6', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
            <div className="column-title" style={{ color: '#6B4E31', fontSize: '1.2rem' }}>التغليف اليوم</div>
            <div className="stat-item" style={{ fontSize: '1.5rem', color: '#D99A2B' }}>20%</div>
          </div>
          <div className="stat-column" style={{ backgroundColor: '#FDFAF6', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
            <div className="column-title" style={{ color: '#6B4E31', fontSize: '1.2rem' }}>الرغيف الباقي</div>
            <div className="stat-item" style={{ fontSize: '1.5rem', color: '#D99A2B' }}>30%</div>
          </div>
          <div className="stat-column" style={{ backgroundColor: '#FDFAF6', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
            <div className="column-title" style={{ color: '#6B4E31', fontSize: '1.2rem' }}>الإشغال</div>
            <div className="stat-item" style={{ fontSize: '1.5rem', color: '#D99A2B' }}>75%</div>
          </div>
        </div>

        <h5 className="dashboard-title" style={{ color: '#4A2C2A', fontSize: '1.8rem', fontFamily: 'Aref Ruqaa' }}>الطلبات الحالية</h5>
        <div className="orders-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {reservations.map((res) => (
            <div key={res.id} style={{ backgroundColor: '#FDFAF6', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ color: '#6B4E31', fontSize: '1.2rem' }}>اسم العميل: {users.find(u => u.phone === res.userId)?.name || 'غير محدد'}</div>
              <div style={{ color: '#6B4E31', fontSize: '1.2rem' }}>التاريخ: {res.date}</div>
              <div style={{ color: '#6B4E31', fontSize: '1.2rem' }}>الكمية: {res.quantity} رغيف</div>
              <div style={{ color: '#6B4E31', fontSize: '1.2rem' }}>الوقت: {res.time}</div>
              <div style={{ color: res.confirmed ? '#28a745' : '#dc3545', fontSize: '1.2rem' }}>
                {res.confirmed ? 'تم التأكيد' : 'قيد المراجعة'}
              </div>
              {!res.confirmed && (
                <button
                  onClick={() => handleConfirmReservation(res.id)}
                  style={{ backgroundColor: '#D99A2B', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '5px', marginTop: '10px' }}
                >
                  تأكيد
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;