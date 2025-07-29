import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import mockUsers from '../modules/mock_users.json';
import { getAllUsers } from '../modules/registeredUsers';
import '../styles/dashboard.css';
import '../styles/auth.css';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [newOrdersCount, setNewOrdersCount] = useState(3);

  useEffect(() => {
    const registeredUsers = getAllUsers();
    const allUsers = [
      ...mockUsers.citizens,
      ...mockUsers.bakers,
      ...registeredUsers,
    ];
    setUsers(allUsers);
  }, []);

  const handleLogout = () => {
    // مسح بيانات الجلسة (مثال)
    localStorage.removeItem('userToken'); // افتراضي، قم بتعديله حسب تخزينك
    // توجيه إلى صفحة تسجيل الدخول
    navigate('/login');
  };

  const sidebarLinks = [
    { path: '/', text: 'نظرة عامة' },
    { path: '/orders', text: 'الطلبات', count: newOrdersCount },
    { path: '/order-history', text: 'سجل الطلبات' },
    { path: '/production', text: 'إدارة الإنتاج' },
  ];

  return (
    <div className="dashboard" style={{ position: 'relative' }}>
      <div className="sidebar-bg"></div>
      <div className="sidebar">
        <div className="sidebar-header">
          <h5 className="sidebar-title">لوحة التحكم</h5>
        </div>
        <ul className="sidebar-nav">
          {sidebarLinks.map((link) => (
            <li className="nav-item mb-2" key={link.path}>
              <Link
                className={`sidebar-link ${location.pathname === link.path ? 'active' : ''}`}
                to={link.path}
              >
                <span className="arabic-text">{link.text}</span>
                {link.count && <span className="sidebar-count">{link.count}</span>}
              </Link>
            </li>
          ))}
          <li className="nav-item mb-2">
            <button className="sidebar-link logout-btn" onClick={handleLogout}>
              <span className="arabic-text">تسجيل الخروج</span>
            </button>
          </li>
        </ul>
      </div>

      <div className="main-content">
        <h5 className="dashboard-title">لوحة التحكم</h5>
        <div className="stats-grid">
          <div className="stat-column">
            <div className="column-title">إعداد الطلبات اليوم</div>
            <div className="stat-item progress-ring-container">
              <div className="progress-ring" style={{ '--p': 50 }} data-label="50%"></div>
            </div>
          </div>
          <div className="stat-column">
            <div className="column-title">التغليف اليوم</div>
            <div className="stat-item progress-ring-container">
              <div className="progress-ring" style={{ '--p': 20 }} data-label="20%"></div>
            </div>
          </div>
          <div className="stat-column">
            <div className="column-title">الرغيف الباقي</div>
            <div className="stat-item progress-ring-container">
              <div className="progress-ring" style={{ '--p': 30 }} data-label="30%"></div>
            </div>
          </div>
          <div className="stat-column">
            <div className="column-title">الإشغال</div>
            <div className="stat-item progress-ring-container">
              <div className="progress-ring" style={{ '--p': 75 }} data-label="75%"></div>
            </div>
          </div>
        </div>

        <h5 className="dashboard-title mt-4">الطلبات الحالية</h5>
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>اسم العميل</th>
              <th>وقت الحجز</th>
              <th>الكمية</th>
              <th>حالة الطلب</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.name || user.bakery_name || 'غير محدد'}</td>
                <td>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</td>
                <td>{user.quantity || 1}</td>
                <td>محجوز</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4">
          <h5 className="dashboard-title">سجل الطلبات</h5>
          <div className="form-group mt-3">
            <label htmlFor="production">كم رغيف هتنتج بكرة؟</label>
            <input type="number" className="form-control w-25" id="production" defaultValue="200" />
            <button className="btn mt-2 button">تحديث</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;