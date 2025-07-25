import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import "../styles/auth.css";


const Login = () => {
  const navigate = useNavigate();

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
      console.log(values);
      alert('تم تسجيل الدخول بنجاح!');
      navigate('/dashboard');
    },
  });

  const getFieldError = (field) =>
    formik.touched[field] && formik.errors[field] ? (
      <div className="text-danger small">{formik.errors[field]}</div>
    ) : null;

  return (
    <div
      className="container-fluid"
      style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}
    >
      <div className="row flex-grow-1 w-100">
        

        <div className="col-md-6 d-flex align-items-center justify-content-center " dir="rtl">
          <div className="p-4 shadow rounded w-100" style={{ maxWidth: '450px', backgroundColor: '#fff' }}>
            <h2 className="text-center mb-4" style={{ color: '#4A2C2A' ,fontFamily: 'Aref Ruqaa'}}>
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
                className="btn w-100"
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

        <div className="col-md-6 d-none d-md-block p-0">
          <img
            src={require('../assets/login1.avif')}
            alt="bread"
            style={{
              width: '100%',
              height: '100%',
              maxHeight: '100vh',
              objectFit: 'contain',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
