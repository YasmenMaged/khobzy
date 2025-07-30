import React, { useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { getUser } from '../modules/registeredUsers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from '../context/UserContext';
import { useUser } from '../context/UserContext';
import mockUsers from '../modules/mock_users.json';
import "../styles/auth.css";

const Login = () => {
  const navigate = useNavigate();
  const { setUserData, setIsLoggedIn } = useUser();

  const formik = useFormik({
    initialValues: {
      phone: '',
      password: '',
    },
    validationSchema: Yup.object({
      phone: Yup.string()
        .matches(/^01[0125][0-9]{8}$/, 'رقم الهاتف غير صالح')
        .required('مطلوب'),
      password: Yup.string()
        .min(6, 'كلمة السر يجب أن تكون 6 أحرف على الأقل')
        .required('مطلوب'),
    }),
    onSubmit: (values) => {
      const { phone, password } = values;
      const normalizedPhone = phone.trim();
      const normalizedPassword = password.trim();

      // Check user in localStorage using getUser
      const user = getUser(normalizedPhone, normalizedPassword);

      if (user) {
        // Fetch additional data from mock_users.json if available
        let fullUserData = { ...user };
        if (user.role === 'citizen') {
          const matchingUser = mockUsers.citizens.find(
            (citizen) => citizen.phone === normalizedPhone && citizen.national_id === user.national_id
          );
          if (matchingUser) {
            fullUserData = { ...fullUserData, ...matchingUser };
          }
        } else if (user.role === 'baker') {
          const matchingUser = mockUsers.bakers.find(
            (baker) => baker.phone === normalizedPhone && baker.national_id === user.national_id
          );
          if (matchingUser) {
            fullUserData = { ...fullUserData, ...matchingUser };
          }
        }

        // Set user data and login state in context
        setUserData(fullUserData);
        setIsLoggedIn(true);
        navigate('/');
      } else {
        toast.error('ليس لديك حساب، يرجى التسجيل أو تحقق من كلمة السر', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    },
  });

  const getFieldError = (field) =>
    formik.touched[field] && formik.errors[field] ? (
      <div className="text-danger small">{formik.errors[field]}</div>
    ) : null;

  return (
    <div
      className="d-flex flex-column flex-md-row"
      style={{ minHeight: '100vh', direction: 'rtl' }}
    >
      <div className="w-100 w-md-50 d-flex align-items-center justify-content-center p-3">
        <div
          className="w-100"
          style={{
            maxWidth: "500px",
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            overflowY: "auto",
            maxHeight: "90vh",
          }}
        >
          <h2 className="text-center mb-4" style={{ color: '#4A2C2A', fontFamily: 'Aref Ruqaa' }}>
            تسجيل الدخول
          </h2>

          <form onSubmit={formik.handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label" style={{ color: '#2E1C1A' }}>
                رقم التليفون
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                className="form-control"
                style={{ backgroundColor: '#E5E5E5' }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
              />
              {getFieldError('phone')}
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label" style={{ color: '#2E1C1A' }}>
                كلمة السر
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                style={{ backgroundColor: '#E5E5E5' }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {getFieldError('password')}
            </div>

            <button
              type="submit"
              className="btn w-100 mt-3"
              style={{
                backgroundColor: '#E0B243',
                color: '#FFFFFF',
                fontSize: '18px',
              }}
            >
              دخول
            </button>

            <p className="mt-3 text-center">
              ليس لديك حساب؟{' '}
              <Link to="/signup" style={{ color: '#E0B243', textDecoration: 'underline' }}>
                إنشاء حساب
              </Link>
            </p>
          </form>
        </div>
      </div>

      <div className="w-100 w-md-50 d-flex align-items-center justify-content-center p-3">
        <div style={{ maxHeight: "90vh", overflow: "hidden" }}>
          <img
            src={require('../assets/login1.avif')}
            alt="bread"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '90vh',
              objectFit: 'cover',
            }}
          />
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;