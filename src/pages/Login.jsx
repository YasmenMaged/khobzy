import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('تم تسجيل الدخول');
      navigate('/dashboard');
    } catch (err) {
      alert('فشل تسجيل الدخول: ' + err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="logo">
          <h1>خبزك</h1>
          <span className="bread-icon">🍞</span>
        </div>
        <form onSubmit={handleLogin} className="auth-form">
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
            تسجيل الدخول
          </button>
        </form>
      </div>
    </div>
  );
}