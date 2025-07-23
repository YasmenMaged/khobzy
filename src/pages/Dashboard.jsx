import React from 'react';
import '../styles/dashboard.css';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h4 className="sidebar-title">مصارفاهيئة</h4>
        </div>
        <nav className="sidebar-nav">
          <Link to="/" className="sidebar-link active">
            <span className="english-text">Dashboard</span>
            <span className="arabic-text">الأربعة الثامنة</span>
            <span className="sidebar-count">250</span>
          </Link>
          <Link to="/dashboard" className="sidebar-link">
            <span className="arabic-text">العدد الفعل اليوم</span>
            <span className="sidebar-count">5</span>
          </Link>
          <Link to="/dashboard" className="sidebar-link">
            <span className="arabic-text">المجموعات</span>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1 className="dashboard-title">Daschbárd</h1>
        
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-column">
            <h3 className="column-title">النظر</h3>
            <div className="stat-item">أعداد على 1080 ص</div>
            <div className="stat-item">حقة حسن 950 ص</div>
            <div className="stat-item">ذلك الهام من 900 ص</div>
            <div className="stat-item">ثم</div>
          </div>
          <div className="stat-column">
            <h3 className="column-title">الكمية</h3>
            <div className="stat-item">10 ص</div>
            <div className="stat-item">5 ص</div>
            <div className="stat-item">3 ص</div>
            <div className="stat-item">ثم</div>
          </div>
          <div className="stat-column">
            <h3 className="column-title">العملة</h3>
            <div className="stat-item">نجد الدكتار</div>
            <div className="stat-item">ثم</div>
            <div className="stat-item">ثم</div>
            <div className="stat-item">ثم</div>
          </div>
          <div className="stat-column">
            <h3 className="column-title">الموعد</h3>
            <div className="stat-item">10:90 ص</div>
            <div className="stat-item">5:50 ص</div>
            <div className="stat-item">3:00 ص</div>
            <div className="stat-item">ثم</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;