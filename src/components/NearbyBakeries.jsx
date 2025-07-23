import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';


const NearbyBakeries = () => {
  const [location, setLocation] = useState(null);
  const [bakeries, setBakeries] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => console.error('Location Error:', error),
      { enableHighAccuracy: true }
    );
  }, []);

  useEffect(() => {
    if (location) {
      const fetchBakeries = async () => {
        const snapshot = await getDocs(collection(db, 'bakeries'));
        const bakeryList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        const sorted = bakeryList
          .map(bakery => ({
            ...bakery,
            distance: calculateDistance(
              location.lat, location.lng,
              bakery.lat, bakery.lng
            ),
          }))
          .sort((a, b) => a.distance - b.distance);

        setBakeries(sorted);
      };

      fetchBakeries();
    }
  }, [location]);

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  return (
    <div className="row">
      {bakeries.map(bakery => (
        <div className="col-md-4 mb-4" key={bakery.id}>
          <div className="card p-3 shadow-sm">
            <h5>{bakery.name}</h5>
            <p>{bakery.description}</p>
            <p><strong>العنوان:</strong> {bakery.address}</p>
            <p><strong>المسافة:</strong> {bakery.distance.toFixed(2)} كم</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NearbyBakeries;
