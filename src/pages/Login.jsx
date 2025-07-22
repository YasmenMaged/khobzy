import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useNavigate } from 'react-router-dom';

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
    <div className="container mt-5" style={{ maxWidth: '450px' }}>
      <h3 className="text-center mb-4">تسجيل الدخول</h3>
      <form onSubmit={handleLogin}>
        <input className="form-control mb-3" type="email" placeholder="الإيميل" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="form-control mb-3" type="password" placeholder="كلمة المرور" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="btn btn-success w-100" type="submit">دخول</button>
      </form>
    </div>
  );
}
