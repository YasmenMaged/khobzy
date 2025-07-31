import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import "../styles/logoutStyle.css";

const Logout = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn, setUserData, setUserType } = useUser();

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    setUserType(null);
    localStorage.removeItem("userType");
  };

  React.useEffect(() => {
    handleLogout();
  }, []);

  return (
    <div className="logout-container">
      <div className="logout-content">
        <h2 style={{ color: '#4A2C2A', fontFamily: 'Aref Ruqaa' }}>تم تسجيل الخروج بنجاح!</h2>
        <p style={{ color: '#2E1C1A' }}>اختر ما تريد القيام به التالي:</p>
        <div className="button-group">
          <button className="logout-btn" onClick={() => navigate('/login')}>
            تسجيل الدخول
          </button>
          <button className="logout-btn" onClick={() => navigate('/signup')}>
            تسجيل حساب جديد "مواطن"
          </button>
          <button className="logout-btn" onClick={() => navigate('/bakerysignup')}>
            تسجيل حساب جديد "صاحب مخبز"
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;