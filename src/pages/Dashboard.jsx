// components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import NearbyBakeries from '../components/NearbyBakeries';

const Dashboard = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => alert("لم نتمكن من الحصول على موقعك")
    );
  }, []);

  return (
    <div className="container">
      <h2 className="mt-3">لوحة المستخدم</h2>
      {location ? (
        <NearbyBakeries userLocation={location} />
      ) : (
        <p>جاري تحديد موقعك...</p>
      )}
    </div>
  );
};

export default Dashboard;
