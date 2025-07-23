import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import "../styles/BakeryCard.css";

const Home = () => {
  return (
   <div className="home-container">
      <h2 className="home-title">المخابز القريبة منك</h2>

      <div className="bakery-list">
        <div className="card bakery-card" style={{ width: "18rem" }}>
          <div className="card-body">
            <h5 className="card-title bakery-card-title">مخبز الهدى</h5>
            <h6 className="card-subtitle mb-2 text-muted bakery-card-address">شارع التحرير</h6>
            <p className="card-text bakery-card-text">
              المتاح: 120 رغيف<br />المسافة: 1.3 كم
            </p>
            <button className="btn bakery-card-button">احجز الآن</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
