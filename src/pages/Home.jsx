import React, { useEffect, useState } from "react";
import { useUser } from '../context/UserContext';
import "../styles/homeStyle.css";
import homeImage from '../assets/back.jpg';
import { useSpring, animated } from 'react-spring';
import { getAllUsers } from "../modules/registeredUsers.js";
import { useNavigate } from "react-router-dom";

const fontAwesomeLink = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css";

const HomePage = () => {
  const { userData } = useUser();
  const navigate = useNavigate();
  const [nearbyBakers, setNearbyBakers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userData || !userData.role) {
        console.error("userData غير موجود أو غير مكتمل:", userData);
        setError("بيانات المستخدم غير متاحة.");
        return;
      }

      if (userData.role !== 'citizen') {
        console.warn("المستخدم ليس مواطنًا:", userData.role);
        return;
      }

      try {
        const governorate = userData.governorate || "غير محدد";
        const district = userData.district || "غير محدد";

        const allUsers = await getAllUsers();
        if (!Array.isArray(allUsers)) {
          console.error("البيانات المسترجعة من getAllUsers ليست مصفوفة:", allUsers);
          setError("فشل في جلب قائمة المستخدمين.");
          return;
        }

        const filteredBakers = allUsers.filter(baker =>
          baker.role === 'baker' &&
          baker.governorate === governorate &&
          baker.district === district
        );
        setNearbyBakers(filteredBakers);
      } catch (err) {
        console.error("خطأ أثناء جلب البيانات:", err);
        setError("حدث خطأ أثناء جلب البيانات: " + err.message);
      }
    };
    fetchUserData();
  }, [userData]);

  const calculateQuotaPercentage = () => {
    if (userData && userData.monthly_bread_quota !== "غير محدد" && userData.available_bread !== "غير محدد") {
      const totalQuota = parseInt(userData.monthly_bread_quota);
      const available = parseInt(userData.available_bread);
      return totalQuota > 0 ? (available / totalQuota) * 100 : 0;
    }
    return 0;
  };

  const quotaPercentage = calculateQuotaPercentage();

  const springProps = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { duration: 1000 },
  });

  const handleReservation = (baker) => {
    navigate('/reservation', { state: { baker } });
  };

  return (
    <>
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
      {userData && userData.role === 'citizen' && (
        <section className="additional-data-section p-4" style={{ backgroundColor: '#F9F5F1', paddingBottom: '40px' }}>
          <div className="additional-data-content p-5 my-5 mx-auto" style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8ece4 100%)',
            borderRadius: '15px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
            maxWidth: '700px',
            border: '1px solid #e0b24333',
          }}>
            <h2 className="text-center mb-5" style={{ color: '#4A2C2A', fontFamily: 'Aref Ruqaa', fontSize: '2.5rem' }}>
              <i className="fas fa-bread-slice rounded-circle" style={{ marginRight: '10px', color: '#DBA132', fontSize: '1.5rem', padding: '8px', backgroundColor: '#f8ece4' }}></i>
              تفاصيل الحصة
            </h2>
            <div className="infographic-grid grid grid-cols-1 md:grid-cols-2 gap-6">
              <animated.div style={springProps} className="infographic-card p-4 bg-white rounded-lg shadow-md">
                <i className="fas fa-users rounded-circle" style={{ fontSize: '1.5rem', color: '#4A2C2A', marginBottom: '10px', padding: '8px', backgroundColor: '#f8ece4' }}></i>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '1.5rem', color: '#4A2C2A', fontFamily: 'Aref Ruqaa' }}>
                  <span style={{color:'#DBA132'}}>أفراد الأسرة:</span>
                  <span>{userData.family_members}</span>
                </div>
              </animated.div>
              <animated.div style={springProps} className="infographic-card p-4 bg-white rounded-lg shadow-md">
                <i className="fas fa-clock rounded-circle" style={{ fontSize: '1.5rem', color: '#4A2C2A', marginBottom: '10px', padding: '8px', backgroundColor: '#f8ece4' }}></i>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '1.5rem', color: '#4A2C2A', fontFamily: 'Aref Ruqaa' }}>
                  <span style={{color:'#DBA132'}}>الرغيف اليومي:</span>
                  <span>{userData.available_bread_per_day} رغيف</span>
                </div>
              </animated.div>
               <animated.div style={springProps} className="infographic-card p-4 bg-white rounded-lg shadow-md">
                <i className="fas fa-check-circle rounded-circle" style={{ fontSize: '1.5rem', color: '#4A2C2A', marginBottom: '10px', padding: '8px', backgroundColor: '#f8ece4' }}></i>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '1.5rem', color: '#4A2C2A', fontFamily: 'Aref Ruqaa' }}>
                  <span style={{color:'#DBA132'}}>  الارغفه المتبقيه:</span>
                  <span>{userData.available_bread} رغيف</span>
                </div>
              </animated.div>
              <animated.div style={springProps} className="infographic-card p-4 bg-white rounded-lg shadow-md">
                <i className="fas fa-calendar-alt rounded-circle" style={{ fontSize: '1.5rem', color: '#4A2C2A', marginBottom: '10px', padding: '8px', backgroundColor: '#f8ece4' }}></i>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '1.5rem', color: '#4A2C2A', fontFamily: 'Aref Ruqaa' }}>
                  <span style={{color:'#DBA132'}}>الحصه الشهريه:</span>
                  <span>{userData.monthly_bread_quota} رغيف</span>
                </div>
              </animated.div>
             
              <animated.div style={springProps} className="infographic-card p-4 bg-white rounded-lg shadow-md col-span-2">
                <i className="fas fa-chart-pie rounded-circle" style={{ fontSize: '1.5rem', color: '#4A2C2A', marginBottom: '10px', padding: '8px', backgroundColor: '#f8ece4' }}></i>
                <h3 style={{ fontFamily: 'Aref Ruqaa', fontSize: '1.5rem', color: '#DBA132' }}>نسبة الرغيف المتاح</h3>
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
      {userData && userData.role === 'citizen' && nearbyBakers.length > 0 && (
        <section className="additional-data-section p-4" style={{ backgroundColor: '#F5F1E8', paddingBottom: '40px' }}>
          <div className="additional-data-content p-5 my-5 mx-auto" style={{
            background: 'linear-gradient(135deg, #FDFAF6 0%, #ECE1D6 100%)',
            borderRadius: '15px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
            maxWidth: '700px',
            border: '1px solid #d99a2b33',
          }}>
            <h2 className="text-center mb-5" style={{ color: '#6B4E31', fontFamily: 'Aref Ruqaa', fontSize: '2.5rem' }}>
              <i className="fas fa-store rounded-circle" style={{ marginRight: '10px', color: '#D99A2B', fontSize: '1.5rem', padding: '8px', backgroundColor: '#ECE1D6' }}></i>
              المخابز القريبة منك
            </h2>
            <div className="infographic-grid grid grid-cols-1 md:grid-cols-2 gap-6">
              {nearbyBakers.map((baker, index) => (
                <animated.div key={index}  className="infographic-card p-4 bg-white rounded-lg shadow-md" style={{springProps, maxWidth: '300px', margin: '0 auto' }}>
                  <i className="fas fa-bread-slice rounded-circle" style={{ fontSize: '1.5rem', color: '#4A2C2A', marginBottom: '10px', padding: '8px', backgroundColor: '#ECE1D6' }}></i>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '1.8rem', color: '#6B4E31', fontFamily: 'Aref Ruqaa' }}>
                    <span style={{ color: '#D99A2B' }}>اسم المخبز:</span>
                    <span style={{ fontSize: '1.5rem' }}>{baker.bakery_name || 'غير محدد'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '1.8rem', color: '#6B4E31', fontFamily: 'Aref Ruqaa', marginTop: '10px' }}>
                    <span style={{ color: '#D99A2B' }}>الموقع:</span>
                    <span style={{ fontSize: '1.5rem' }}>{baker.location || 'غير محدد'}</span>
                  </div>
                  <button
                    className="reserve-btn mt-3"
                    onClick={() => handleReservation(baker)}
                    style={{
                      backgroundColor: '#D99A2B',
                      color: '#FFFFFF',
                      padding: '8px 16px',
                      borderRadius: '5px',
                      border: 'none',
                      fontSize: '1rem',
                    }}
                  >
                    احجز الآن
                  </button>
                </animated.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default HomePage;