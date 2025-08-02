import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import '../styles/navbar.css';
import Swal from 'sweetalert2';

const Navbar = () => {
  const { userType, isLoggedIn, setIsLoggedIn, setUserData, userData } = useUser();
  const navigate = useNavigate();

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success m-2',
      cancelButton: 'btn btn-danger m-2',
    },
    buttonsStyling: false,
  });

  const handleLogout = () => {
    swalWithBootstrapButtons
      .fire({
        title: 'هل أنت متأكد؟',
        text: 'لن تتمكن من التراجع عن هذا الإجراء!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'نعم، قم بتسجيل الخروج!',
        cancelButtonText: 'لا، إلغاء!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          console.log('Logging out user:', userData);
          setIsLoggedIn(false);
          setUserData({}); // تعيين userData إلى كائن فارغ بدلاً من null
          localStorage.removeItem('userToken'); // إزالة التوكن إذا كان موجودًا
          swalWithBootstrapButtons.fire({
            title: 'تم تسجيل الخروج!',
            text: 'تم تسجيل الخروج بنجاح.',
            icon: 'success',
          }).then(() => {
            navigate('/login'); // إعادة التوجيه إلى صفحة تسجيل الدخول
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: 'تم الإلغاء',
            text: 'جلسة العمل الخاصة بك آمنة :)',
            icon: 'error',
          });
        }
      });
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top navbar-custom">
      <div className="container-fluid">
        {isLoggedIn &&   
          <Link to="/profile">
            <i className="fa-solid fa-circle-user fa-xl" style={{color: '#D99A2B'}}></i> 
          </Link>
        }
        <Link className="navbar-brand fs-4" to="/" style={{ fontWeight: 'bold' }}>
          خبزي
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                الصفحة الرئيسية
              </Link>
            </li>
            {isLoggedIn && userType === 'citizen' && (
              <li className="nav-item">
                <Link className="nav-link" to="/reservation-history">
                  طلباتي
                </Link>
              </li>
            )}
            {isLoggedIn && userType === 'owner' && (
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">
                  لوحة التحكم
                </Link>
              </li>
            )}
            {!isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">
                    إنشاء حساب
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    تسجيل الدخول
                  </Link>
                </li>
              </>
            )}
            {isLoggedIn && (
              <li className="nav-item">
                <Link className="nav-link" onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}>
                  تسجيل الخروج
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;