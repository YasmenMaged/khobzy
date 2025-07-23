import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';


const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      alert("تم إنشاء الحساب بنجاح");
      navigate('/dashboard');
    } catch (error) {
      alert("حدث خطأ: " + error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="logo">
          <h1>خبزك</h1>
          <span className="bread-icon">🍞</span>
        </div>
        <form onSubmit={handleSignup} className="auth-form">
          <input
            type="email"
            className="form-control mb-3"
            placeholder="الإيميل"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="form-control mb-3"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn btn-custom w-100">
            تسجيل
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;