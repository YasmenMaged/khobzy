import React, { useEffect, useState } from "react";
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSpring, animated } from 'react-spring';
import { db } from '../services/firebase.js'; // استيراد Firestore من firebase.js
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Swal from "sweetalert2";

const fontAwesomeLink = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css";

const Profile = () => {
  const { userData, setUserData, setIsLoggedIn } = useUser();
  const [additionalData, setAdditionalData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchUserData = async () => {
      if (userData && userData.phone) {
        const userRef = doc(db, "users", userData.phone);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
          setAdditionalData(userSnap.data());
        }
      }
    };
    fetchUserData();
  }, [userData?.phone, setUserData]);

  const handleEdit = () => {
    setEditMode(true);
    setEditedData({ ...userData });
  };

  const handleSave = async () => {
    if (userData && userData.phone) {
      const userRef = doc(db, "users", userData.phone);
      await setDoc(userRef, { ...userData, ...editedData }, { merge: true });
      setEditMode(false);
      setEditedData({});
      setUserData({ ...userData, ...editedData });
      toast.success("تم تحديث البيانات بنجاح", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };
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
             navigate('/login')
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

  const springProps = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { duration: 1000 },
  });

  return (
    <>
      <link rel="stylesheet" href={fontAwesomeLink} />
      <div className="profile-container" style={{ backgroundColor: '#F9F5F1', minHeight: '100vh', padding: '40px 0' }}>
        <div className="profile-content p-5 my-5 mx-auto" style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8ece4 100%)',
          borderRadius: '15px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
          maxWidth: '700px',
          border: '1px solid #e0b24333',
        }}>
          {userData && (
            <>
              <h2 className="text-center mb-5" style={{ color: '#4A2C2A', fontFamily: 'Cairo', fontSize: '2.5rem' }}>
                <i className="fas fa-user" style={{ marginRight: '10px', color: '#d99a2b', padding: '5px' }}></i>
                ملفي الشخصي
              </h2>
              <animated.div style={springProps}>
                <div className="user-details">
                  {userData.role === 'citizen' && (
                    <>
                    <div className="field-group">
                        <label style={{ fontSize: '1.2rem', color: '#4A2C2A' }}><i className="fas fa-user" style={{ marginRight: '10px', color: '#d99a2b', padding: '5px' }}></i>الاسم :</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={editedData.name || ''}
                            onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                            style={{ width: '100%', padding: '8px', backgroundColor: '#E5E5E5', borderRadius: '5px', border: '1px solid #e0b24333' }}
                          />
                        ) : (
                          <p style={{ fontSize: '1.2rem' }}>{userData.name}</p>
                        )}
                      </div>
                      <div className="field-group">
                        <label style={{ fontSize: '1.2rem', color: '#4A2C2A' }}><i className="fas fa-id-card" style={{ marginRight: '10px', color: '#d99a2b', padding: '5px' }}></i>الرقم القومي:</label>
                            <p style={{ fontSize: '1.2rem' }}>{userData.national_id}</p>
                        
                      </div>
                      <div className="field-group">
                        <label style={{ fontSize: '1.2rem', color: '#4A2C2A' }}><i className="fas fa-phone" style={{ marginRight: '10px', color: '#d99a2b', padding: '5px' }}></i>رقم الهاتف:</label>
                          <p style={{ fontSize: '1.2rem' }}>{userData.phone}</p>
                        
                        
                      </div>
                      <div className="field-group">
                        <label style={{ fontSize: '1.2rem', color: '#4A2C2A' }}><i className="fas fa-envelope" style={{ marginRight: '10px', color: '#d99a2b', padding: '5px' }}></i>البريد الإلكتروني:</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={editedData.email || ''}
                            onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                            style={{ width: '100%', padding: '8px', backgroundColor: '#E5E5E5', borderRadius: '5px', border: '1px solid #e0b24333' }}
                          />
                        ) : (
                          <p style={{ fontSize: '1.2rem' }}>{userData.email || "غير محدد"}</p>
                        )}
                      </div>
                      <div className="field-group">
                        <label style={{ fontSize: '1.2rem', color: '#4A2C2A' }}><i className="fas fa-map-marker-alt" style={{ marginRight: '10px', color: '#d99a2b', padding: '5px' }}></i>المحافظة:</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={editedData.governorate || ''}
                            onChange={(e) => setEditedData({ ...editedData, governorate: e.target.value })}
                            style={{ width: '100%', padding: '8px', backgroundColor: '#E5E5E5', borderRadius: '5px', border: '1px solid #e0b24333' }}
                          />
                        ) : (
                          <p style={{ fontSize: '1.2rem' }}>{userData.governorate}</p>
                        )}
                      </div>
                      <div className="field-group">
                        <label style={{ fontSize: '1.2rem', color: '#4A2C2A' }}><i className="fas fa-map" style={{ marginRight: '10px', color: '#d99a2b', padding: '5px' }}></i>المركز:</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={editedData.district || ''}
                            onChange={(e) => setEditedData({ ...editedData, district: e.target.value })}
                            style={{ width: '100%', padding: '8px', backgroundColor: '#E5E5E5', borderRadius: '5px', border: '1px solid #e0b24333' }}
                          />
                        ) : (
                          <p style={{ fontSize: '1.2rem' }}>{userData.district}</p>
                        )}
                      </div>
                      <div className="field-group">
                        <label style={{ fontSize: '1.2rem', color: '#4A2C2A' }}><i className="fas fa-home" style={{ marginRight: '10px', color: '#d99a2b', padding: '5px' }}></i>القرية:</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={editedData.village || ''}
                            onChange={(e) => setEditedData({ ...editedData, village: e.target.value })}
                            style={{ width: '100%', padding: '8px', backgroundColor: '#E5E5E5', borderRadius: '5px', border: '1px solid #e0b24333' }}
                          />
                        ) : (
                          <p style={{ fontSize: '1.2rem' }}>{userData.village || "غير محدد"}</p>
                        )}
                      </div>
                    </>
                  )}
                  {userData.role === 'baker' && (
                    <>
                      <div className="field-group">
                        <label style={{ fontSize: '1.2rem', color: '#4A2C2A' }}><i className="fas fa-id-card" style={{ marginRight: '10px', color: '#d99a2b', padding: '5px' }}></i>الرقم القومي:</label>
                          <p style={{ fontSize: '1.2rem' }}>{userData.national_id}</p>
                       
                         
                      </div>
                      <div className="field-group">
                        <label style={{ fontSize: '1.2rem', color: '#4A2C2A' }}><i className="fas fa-phone" style={{ marginRight: '10px', color: '#d99a2b', padding: '5px' }}></i>رقم الهاتف:</label>
                          <p style={{ fontSize: '1.2rem' }}>{userData.phone}</p>
                        
                        
                      </div>
                      <div className="field-group">
                        <label style={{ fontSize: '1.2rem', color: '#4A2C2A' }}><i className="fas fa-shop" style={{ marginRight: '10px', color: '#d99a2b', padding: '5px' }}></i>اسم المخبز:</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={editedData.bakery_name || ''}
                            onChange={(e) => setEditedData({ ...editedData, bakery_name: e.target.value })}
                            style={{ width: '100%', padding: '8px', backgroundColor: '#E5E5E5', borderRadius: '5px', border: '1px solid #e0b24333' }}
                          />
                        ) : (
                          <p style={{ fontSize: '1.2rem' }}>{userData.bakery_name}</p>
                        )}
                      </div>
                      <div className="field-group">
                        <label style={{ fontSize: '1.2rem', color: '#4A2C2A' }}><i className="fas fa-map-marker-alt" style={{ marginRight: '10px', color: '#d99a2b', padding: '5px' }}></i>الموقع:</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={editedData.location || ''}
                            onChange={(e) => setEditedData({ ...editedData, location: e.target.value })}
                            style={{ width: '100%', padding: '8px', backgroundColor: '#E5E5E5', borderRadius: '5px', border: '1px solid #e0b24333' }}
                          />
                        ) : (
                          <p style={{ fontSize: '1.2rem' }}>{userData.location}</p>
                        )}
                      </div>
                      <div className="field-group">
                        <label style={{ fontSize: '1.2rem', color: '#4A2C2A' }}><i className="fas fa-map" style={{ marginRight: '10px', color: '#d99a2b', padding: '5px' }}></i>المحافظة:</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={editedData.governorate || ''}
                            onChange={(e) => setEditedData({ ...editedData, governorate: e.target.value })}
                            style={{ width: '100%', padding: '8px', backgroundColor: '#E5E5E5', borderRadius: '5px', border: '1px solid #e0b24333' }}
                          />
                        ) : (
                          <p style={{ fontSize: '1.2rem' }}>{userData.governorate}</p>
                        )}
                      </div>
                      <div className="field-group">
                        <label style={{ fontSize: '1.2rem', color: '#4A2C2A' }}><i className="fas fa-map" style={{ marginRight: '10px', color: '#d99a2b', padding: '5px' }}></i>المركز:</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={editedData.district || ''}
                            onChange={(e) => setEditedData({ ...editedData, district: e.target.value })}
                            style={{ width: '100%', padding: '8px', backgroundColor: '#E5E5E5', borderRadius: '5px', border: '1px solid #e0b24333' }}
                          />
                        ) : (
                          <p style={{ fontSize: '1.2rem' }}>{userData.district}</p>
                        )}
                      </div>
                      <div className="field-group">
                        <label style={{ fontSize: '1.2rem', color: '#4A2C2A' }}><i className="fas fa-home" style={{ marginRight: '10px', color: '#d99a2b', padding: '5px' }}></i>القرية:</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={editedData.village || ''}
                            onChange={(e) => setEditedData({ ...editedData, village: e.target.value })}
                            style={{ width: '100%', padding: '8px', backgroundColor: '#E5E5E5', borderRadius: '5px', border: '1px solid #e0b24333' }}
                          />
                        ) : (
                          <p style={{ fontSize: '1.2rem' }}>{userData.village || "غير محدد"}</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
                <div className="button-group mt-4" style={{ textAlign: 'center' }}>
                  {editMode ? (
                    <button
                      onClick={handleSave}
                      style={{ backgroundColor: '#E0B243', color: '#FFFFFF', padding: '10px 20px', borderRadius: '5px', border: 'none', fontSize: '1rem', marginRight: '10px' }}
                    >
                      حفظ
                    </button>
                  ) : (
                    <button
                      onClick={handleEdit}
                      style={{ backgroundColor: '#E0B243', color: '#FFFFFF', padding: '10px 20px', borderRadius: '5px', border: 'none', fontSize: '1rem', marginRight: '10px' }}
                    >
                      تعديل
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    style={{ backgroundColor: '#d99a2b', color: '#FFFFFF', padding: '10px 20px', borderRadius: '5px', border: 'none', fontSize: '1rem' }}
                  >
                    تسجيل الخروج
                  </button>
                </div>
              </animated.div>
            </>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Profile;