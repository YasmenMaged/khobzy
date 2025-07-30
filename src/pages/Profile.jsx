import React, { useEffect, useState } from "react";
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSpring, animated } from 'react-spring';
import mockUsers from "../modules/mock_users.json";
import { addUser } from "../modules/registeredUsers";

// Add FontAwesome CDN
const fontAwesomeLink = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css";

const Profile = () => {
  const { userData, setUserData } = useUser();
  const [additionalData, setAdditionalData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (userData && userData.role === 'citizen') {
      const matchingUser = mockUsers.citizens.find(
        (citizen) =>
          citizen.phone === userData.phone &&
          citizen.national_id === userData.national_id
      );
      if (matchingUser) {
        setAdditionalData({
          family_members: matchingUser.family_members || "غير محدد",
          monthly_bread_quota: matchingUser.monthly_bread_quota || "غير محدد",
          available_bread_per_day: matchingUser.available_bread_per_day || "غير محدد",
          available_bread: matchingUser.available_bread || "غير محدد",
        });
      }
    }
  }, [userData]);

  const handleEdit = () => {
    setEditMode(true);
    setEditedData({ ...userData });
  };

  const handleSave = () => {
    // Update only via localStorage using addUser
    const { success } = addUser({ ...userData, ...editedData });
    if (success) {
      // Reset to original view after save
      setEditMode(false);
      setEditedData({}); // Clear editedData to avoid showing it
      setUserData({ ...userData, ...editedData }); // Update userData with new values
      toast.success("تم حفظ التعديل بنجاح", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleLogout = () => {
    navigate('/logout');
  };

  // Animation for user details
  const springProps = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { duration: 1000 },
  });

  return (
    <>
      {/* FontAwesome CDN Link */}
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
              <h2 className="text-center mb-5" style={{ color: '#4A2C2A', fontFamily: 'Aref Ruqaa', fontSize: '2.5rem' }}>
                <i className="fas fa-user" style={{ marginRight: '10px', color: '#d99a2b', padding: '5px' }}></i>
                ملفي الشخصي
              </h2>
              <animated.div style={springProps}>
                <div className="user-details">
                  {userData.role === 'citizen' && (
                    <>
                      <div className="field-group">
                        <label style={{ fontSize: '1.2rem', color: '#4A2C2A' }}><i className="fas fa-id-card" style={{ marginRight: '10px', color: '#d99a2b', padding: '5px' }}></i>الرقم القومي:</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={editedData.national_id || ''}
                            onChange={(e) => setEditedData({ ...editedData, national_id: e.target.value })}
                            style={{ width: '100%', padding: '8px', backgroundColor: '#E5E5E5', borderRadius: '5px', border: '1px solid #e0b24333' }}
                          />
                        ) : (
                          <p style={{ fontSize: '1.2rem' }}>{userData.national_id}</p>
                        )}
                      </div>
                      <div className="field-group">
                        <label style={{ fontSize: '1.2rem', color: '#4A2C2A' }}><i className="fas fa-phone" style={{ marginRight: '10px', color: '#d99a2b', padding: '5px' }}></i>رقم الهاتف:</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={editedData.phone || ''}
                            onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                            style={{ width: '100%', padding: '8px', backgroundColor: '#E5E5E5', borderRadius: '5px', border: '1px solid #e0b24333' }}
                          />
                        ) : (
                          <p style={{ fontSize: '1.2rem' }}>{userData.phone}</p>
                        )}
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
                        {editMode ? (
                          <input
                            type="text"
                            value={editedData.national_id || ''}
                            onChange={(e) => setEditedData({ ...editedData, national_id: e.target.value })}
                            style={{ width: '100%', padding: '8px', backgroundColor: '#E5E5E5', borderRadius: '5px', border: '1px solid #e0b24333' }}
                          />
                        ) : (
                          <p style={{ fontSize: '1.2rem' }}>{userData.national_id}</p>
                        )}
                      </div>
                      <div className="field-group">
                        <label style={{ fontSize: '1.2rem', color: '#4A2C2A' }}><i className="fas fa-phone" style={{ marginRight: '10px', color: '#d99a2b', padding: '5px' }}></i>رقم الهاتف:</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={editedData.phone || ''}
                            onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                            style={{ width: '100%', padding: '8px', backgroundColor: '#E5E5E5', borderRadius: '5px', border: '1px solid #e0b24333' }}
                          />
                        ) : (
                          <p style={{ fontSize: '1.2rem' }}>{userData.phone}</p>
                        )}
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