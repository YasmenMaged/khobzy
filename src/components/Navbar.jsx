import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import '../styles/navbar.css'; // Assuming you have a CSS file for styling

const Navbar = () => {
  const { userType } = useUser();

  return (
    <nav className="navbar navbar-expand-lg fixed-top navbar-custom">
      <div className="container-fluid">
        <Link className="navbar-brand fs-4" to="/" style={{ fontWeight: 'bold' }}>
          خبزي
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                الصفحة الرئيسية
              </Link>
            </li>
            {userType === 'owner' && (
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">
                  لوحة التحكم
                </Link>
              </li>
            )}
            <li className="nav-item">
              <Link className="nav-link" to="/choose-role">
                تسجيل الدخول
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;