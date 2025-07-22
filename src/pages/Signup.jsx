// components/Signup.jsx
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("تم إنشاء الحساب بنجاح");
    } catch (error) {
      alert("حدث خطأ: " + error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>تسجيل حساب جديد</h2>
      <form onSubmit={handleSignup}>
        <input type="email" className="form-control mb-2" placeholder="الإيميل" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="form-control mb-2" placeholder="كلمة المرور" onChange={(e) => setPassword(e.target.value)} />
        <button className="btn btn-primary">تسجيل</button>
      </form>
    </div>
  );
};

export default Signup;
