
import React from "react";
import "../styles/home.css";
import homeImage from '../assets/home.jpg';
// import { Button } from "react-bootstrap/Button";



const HomePage = () => {
  return (
    <div className="home-container"
    style={{
        backgroundImage: `url(${homeImage})`,
    
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        
      }}
      >
      <header className="hero-section" >

          <div className="hero-content">
        
            <h1>خبزك في متناول يدك</h1>
            <h4>احجز العيش و مستلزماتك اليومية بسهولة من أقرب مخبز ليك</h4>
            <button className="cta-btn">ابدأ الآن</button>
          
          </div>
      </header>

    </div>
  );
};

export default HomePage;
