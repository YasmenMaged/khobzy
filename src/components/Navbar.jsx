import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    <div className="container">
      <Link className="navbar-brand" to="/">خبزك</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">الرئيسية</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/dashboard">لوحة التحكم</Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

export default Navbar;
