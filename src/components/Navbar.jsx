import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="navbar">
    <div className="navbar-brand">خبزك</div>
    <div className="navbar-links">
      <Link to="/" className="nav-link">الرئيسية</Link>
      <Link to="/dashboard" className="nav-link">لوحة التحكم</Link>
    </div>
  </nav>
);

export default Navbar;