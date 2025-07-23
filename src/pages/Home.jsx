
import React from "react";
import "../styles/home.css";
// import { Button } from "react-bootstrap/Button";



const HomePage = () => {
  return (

    <div className="home-container">
      <header className="hero-section">
       
          <div className="hero-content">
            <h1>خبزك في متناول يدك</h1>
            <p>احجز العيش و مستلزماتك اليومية بسهولة من أقرب مخبز ليك</p>
            <button className="cta-btn">ابدأ الآن</button>
          
        </div>
      </header>

    </div>
  );
};

export default HomePage;
