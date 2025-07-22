import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="hero-section text-center p-5">
        <h1 className="display-4 fw-bold">مرحبا بك في خبزك</h1>
        <p className="lead">احجز خبزك بسهولة من أقرب مخبز</p>
        <Link to="/dashboard" className="btn btn-primary mt-3">ابدأ الآن</Link>
      </header>
    </div>
  );
};

export default Home;
