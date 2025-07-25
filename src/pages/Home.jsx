import React from "react";
import { useUser } from '../context/UserContext';
import "../styles/homeStyle.css";
import homeImage from '../assets/bg.jpg';

const HomePage = () => {
  const { userData } = useUser();

  return (
    <>
    
    <div className="home-container"
      style={{
        backgroundImage: `url(${homeImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <header className="hero-section">
        <div className="hero-content">
          <h1>خبزك في متناول يدك</h1>
          <h4>احجز العيش و مستلزماتك اليومية بسهولة من أقرب مخبز ليك</h4>
          <button className="start-btn">ابدأ الآن</button>
        </div>
      </header>
 </div>
      {userData && (
        <section className="user-data-section  p-4" style={{ backgroundColor: '#F9F5F1' }}  >
          <div className="user-data-content p-4 my-4" style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <h2 className="text-center mb-4" style={{ color: '#4A2C2A', fontFamily: 'Aref Ruqaa' }}>مرحباً، {userData.name}!</h2>
            <div className="user-details">
              {userData.role === 'citizen' && (
                <>
                  <p><strong>عدد أفراد الأسرة:</strong> {userData.family_members}</p>
                  <p><strong>الحصة الشهرية:</strong> {userData.monthly_bread_quota} رغيف</p>
                  <p><strong>الرغيف المتاح يومياً:</strong> {userData.available_bread_per_day} رغيف</p>
                  <p><strong>الرغيف المتاح الكلي:</strong> {userData.available_bread} رغيف</p>
                </>
              )}
              {userData.role === 'baker' && (
                <>
                  <p><strong>اسم المخبز:</strong> {userData.bakery_name}</p>
                  <p><strong>الموقع:</strong> {userData.location}</p>
                </>
              )}
            </div>
          </div>
        </section>
      )}
   
    </>
  );
};

export default HomePage;