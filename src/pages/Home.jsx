import React, { useEffect, useState } from "react";
import { useUser } from '../context/UserContext';
import "../styles/homeStyle.css";
import homeImage from '../assets/back.jpg';
import mockUsers from "../modules/mock_users.json";
import { useSpring, animated } from 'react-spring'; // Import react-spring for animations

// Add FontAwesome CDN
const fontAwesomeLink = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css";

const HomePage = () => {
  const { userData } = useUser();
  const [additionalData, setAdditionalData] = useState(null);

  useEffect(() => {
    if (userData && userData.role === 'citizen') {
      const matchingUser = mockUsers.citizens.find(
        (citizen) =>
          citizen.phone === userData.phone &&
          citizen.national_id === userData.national_id
      );
      if (matchingUser) {
        setAdditionalData({
          family_members: matchingUser.family_members || "غير محدد",
          monthly_bread_quota: matchingUser.monthly_bread_quota || "غير محدد",
          available_bread_per_day: matchingUser.available_bread_per_day || "غير محدد",
          available_bread: matchingUser.available_bread || "غير محدد",
        });
      }
    }
  }, [userData]);

  // Calculate percentage for progress
  const calculateQuotaPercentage = () => {
    if (additionalData && additionalData.monthly_bread_quota !== "غير محدد" && additionalData.available_bread !== "غير محدد") {
      const totalQuota = parseInt(additionalData.monthly_bread_quota);
      const available = parseInt(additionalData.available_bread);
      return totalQuota > 0 ? (available / totalQuota) * 100 : 0;
    }
    return 0;
  };

  const quotaPercentage = calculateQuotaPercentage();

  // Animation for infographic cards
  const springProps = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { duration: 1000 },
  });

  return (
    <>
      {/* FontAwesome CDN Link */}
      <link rel="stylesheet" href={fontAwesomeLink} />

      <div className="home-container"
        style={{
          backgroundImage: `url(${homeImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
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
        <section className="user-data-section p-4" style={{ backgroundColor: '#F9F5F1', paddingTop: '40px' }}>
          <div className="user-data-content p-5 my-5 mx-auto" style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8ece4 100%)',
            borderRadius: '15px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
            maxWidth: '700px',
            border: '1px solid #e0b24333',
          }}>
            <h2 className="text-center mb-5" style={{ color: '#4A2C2A', fontFamily: 'Aref Ruqaa', fontSize: '2.5rem' }}>
              <i className="fas fa-user" style={{ marginRight: '10px', color: '#E0B243' }}></i>
              مرحباً، {userData.name}!
            </h2>
            <div className="user-details grid grid-cols-1 md:grid-cols-2 gap-4">
              {userData.role === 'citizen' && (
                <>
                  <div className="p-3 bg-white rounded-lg shadow-md">
                    <p style={{ fontSize: '1.2rem' }}><i className="fas fa-id-card" style={{ marginRight: '10px', color: '#4A2C2A' }}></i><strong>الرقم القومي:</strong> {userData.national_id}</p>
                    <p style={{ fontSize: '1.2rem' }}><i className="fas fa-phone" style={{ marginRight: '10px', color: '#4A2C2A' }}></i><strong>رقم الهاتف:</strong> {userData.phone}</p>
                    <p style={{ fontSize: '1.2rem' }}><i className="fas fa-envelope" style={{ marginRight: '10px', color: '#4A2C2A' }}></i><strong>البريد الإلكتروني:</strong> {userData.email || "غير محدد"}</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg shadow-md">
                    <p style={{ fontSize: '1.2rem' }}><i className="fas fa-map-marker-alt" style={{ marginRight: '10px', color: '#4A2C2A' }}></i><strong>المحافظة:</strong> {userData.governorate}</p>
                    <p style={{ fontSize: '1.2rem' }}><i className="fas fa-map" style={{ marginRight: '10px', color: '#4A2C2A' }}></i><strong>المركز:</strong> {userData.district}</p>
                    <p style={{ fontSize: '1.2rem' }}><i className="fas fa-home" style={{ marginRight: '10px', color: '#4A2C2A' }}></i><strong>القرية:</strong> {userData.village || "غير محدد"}</p>
                  </div>
                </>
              )}
              {userData.role === 'baker' && (
                <>
                  <div className="p-3 bg-white rounded-lg shadow-md">
                    <p style={{ fontSize: '1.2rem' }}><i className="fas fa-id-card" style={{ marginRight: '10px', color: '#4A2C2A' }}></i><strong>الرقم القومي:</strong> {userData.national_id}</p>
                    <p style={{ fontSize: '1.2rem' }}><i className="fas fa-phone" style={{ marginRight: '10px', color: '#4A2C2A' }}></i><strong>رقم الهاتف:</strong> {userData.phone}</p>
                    <p style={{ fontSize: '1.2rem' }}><i className="fas fa-shop" style={{ marginRight: '10px', color: '#4A2C2A' }}></i><strong>اسم المخبز:</strong> {userData.bakery_name}</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg shadow-md">
                    <p style={{ fontSize: '1.2rem' }}><i className="fas fa-map-marker-alt" style={{ marginRight: '10px', color: '#4A2C2A' }}></i><strong>الموقع:</strong> {userData.location}</p>
                    <p style={{ fontSize: '1.2rem' }}><i className="fas fa-map" style={{ marginRight: '10px', color: '#4A2C2A' }}></i><strong>المحافظة:</strong> {userData.governorate}</p>
                    <p style={{ fontSize: '1.2rem' }}><i className="fas fa-map" style={{ marginRight: '10px', color: '#4A2C2A' }}></i><strong>المركز:</strong> {userData.district}</p>
                    <p style={{ fontSize: '1.2rem' }}><i className="fas fa-home" style={{ marginRight: '10px', color: '#4A2C2A' }}></i><strong>القرية:</strong> {userData.village || "غير محدد"}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {userData && userData.role === 'citizen' && additionalData && (
        <section className="additional-data-section p-4" style={{ backgroundColor: '#F9F5F1', paddingBottom: '40px' }}>
          <div className="additional-data-content p-5 my-5 mx-auto" style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8ece4 100%)',
            borderRadius: '15px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
            maxWidth: '700px',
            border: '1px solid #e0b24333',
          }}>
            <h2 className="text-center mb-5" style={{ color: '#4A2C2A', fontFamily: 'Aref Ruqaa', fontSize: '2.5rem' }}>
              <i className="fas fa-bread-slice" style={{ marginRight: '10px', color: '#E0B243' }}></i>
              تفاصيل الحصة
            </h2>
            <div className="infographic-grid grid grid-cols-1 md:grid-cols-2 gap-6">
              <animated.div style={springProps} className="infographic-card p-4 bg-white rounded-lg shadow-md">
                <i className="fas fa-users" style={{ fontSize: '1.5rem', color: '#4A2C2A', marginBottom: '10px' }}></i>
                <h3 style={{ fontFamily: 'Aref Ruqaa', fontSize: '1.5rem', color: '#4A2C2A' }}>أفراد الأسرة</h3>
                <p style={{ fontSize: '1.2rem' }}>{additionalData.family_members}</p>
              </animated.div>
              <animated.div style={springProps} className="infographic-card p-4 bg-white rounded-lg shadow-md">
                <i className="fas fa-clock" style={{ fontSize: '1.5rem', color: '#4A2C2A', marginBottom: '10px' }}></i>
                <h3 style={{ fontFamily: 'Aref Ruqaa', fontSize: '1.5rem', color: '#4A2C2A' }}>الرغيف اليومي</h3>
                <p style={{ fontSize: '1.2rem' }}>{additionalData.available_bread_per_day} رغيف</p>
              </animated.div>
              <animated.div style={springProps} className="infographic-card p-4 bg-white rounded-lg shadow-md col-span-2">
                <i className="fas fa-chart-pie" style={{ fontSize: '1.5rem', color: '#E0B243', marginBottom: '10px' }}></i>
                <h3 style={{ fontFamily: 'Aref Ruqaa', fontSize: '1.5rem', color: '#4A2C2A' }}>نسبة الرغيف المتاح</h3>
                <div className="progress-container">
                  <p style={{ fontSize: '1.2rem', color: '#4A2C2A' }}>{Math.round(quotaPercentage)}%</p>
                  <div className="progress-bar-wrapper">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${quotaPercentage}%`,
                        background: `linear-gradient(90deg, #E0B243 0%, #d99a2b 100%)`,
                        transition: 'width 1.5s ease-in-out',
                      }}
                    ></div>
                  </div>
                </div>
              </animated.div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default HomePage;