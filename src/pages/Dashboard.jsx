import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import mockUsers from "../modules/mock_users.json";
import { getAllUsers } from "../modules/registeredUsers";
import { useUser } from "../context/UserContext";
import "../styles/dashboard.css";
import "../styles/auth.css";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { firebaseConfig } from "../services/firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Dashboard = () => {
  const { userType, userData } = useUser();
  const [users, setUsers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [confirmedReservations, setConfirmedReservations] = useState([]);
  const [dailyQuota, setDailyQuota] = useState(0);
  const [remainingQuota, setRemainingQuota] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const currentDate = new Date().toISOString().split("T")[0]; // 2025-08-03

  useEffect(() => {
    if (userType !== "owner") {
      navigate("/");
      return;
    }

    const fetchUsers = async () => {
      try {
        const registeredUsers = await getAllUsers();
        const allUsers = [
          ...mockUsers.citizens,
          ...mockUsers.bakers,
          ...(Array.isArray(registeredUsers) ? registeredUsers : []),
        ];
        setUsers(allUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([...mockUsers.citizens, ...mockUsers.bakers]);
      }
    };

    const fetchReservations = async () => {
      if (!userData?.national_id) return;
      const q = query(
        collection(db, "reservations"),
        where("bakery_owner_national_id", "==", userData.national_id)
      );
      const querySnapshot = await getDocs(q);
      const reservationsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Separate pending and confirmed/rejected reservations
      const pendingReservations = reservationsList.filter(
        (res) => !res.confirmed && !res.rejected
      );
      const confirmedReservationsList = reservationsList.filter(
        (res) => res.confirmed || res.rejected
      );

      setReservations(pendingReservations);
      setConfirmedReservations(confirmedReservationsList);

      // Update newOrdersCount for current date
      setNewOrdersCount(
        pendingReservations.filter(
          (res) => res.date === currentDate
        ).length
      );
    };

    const fetchAndUpdateQuota = async () => {
      if (!userData?.national_id) {
        console.warn("national_id غير موجود للمستخدم.");
        return;
      }
      const bakeryRef = doc(db, "bakeries", userData.national_id);
      const bakeryDoc = await getDoc(bakeryRef);

      if (bakeryDoc.exists()) {
        const data = bakeryDoc.data();
        const storedQuota = data.daily_quota || 100;
        let storedRemaining = data.remaining_quota || storedQuota;
        const lastReset = data.last_reset_date || null;

        if (!lastReset || lastReset !== currentDate) {
          storedRemaining = storedQuota;
          await updateDoc(bakeryRef, {
            remaining_quota: storedRemaining,
            last_reset_date: currentDate,
          });
        }

        setDailyQuota(storedQuota);
        setRemainingQuota(storedRemaining);
      } else {
        await updateDoc(bakeryRef, {
          owners_national_id: userData.national_id,
          bakery_name: userData.bakery_name,
          daily_quota: 100,
          remaining_quota: 100,
          last_reset_date: currentDate,
        });
        setDailyQuota(100);
        setRemainingQuota(100);
      }
    };

    fetchUsers();
    fetchReservations();
    fetchAndUpdateQuota();
  }, [userType, navigate, userData, currentDate]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  const handleConfirmReservation = async (reservationId) => {
    if (!userData?.national_id) {
      toast.error("بيانات المستخدم غير مكتملة!", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    const reservationRef = doc(db, "reservations", reservationId);
    const reservation = reservations.find((res) => res.id === reservationId);
    const bakeryRef = doc(db, "bakeries", userData.national_id);
    const bakeryDoc = await getDoc(bakeryRef);

    if (bakeryDoc.exists() && remainingQuota >= reservation.quantity) {
      const newRemaining = remainingQuota - reservation.quantity;
      await updateDoc(bakeryRef, { remaining_quota: newRemaining });
      await updateDoc(reservationRef, { confirmed: true, rejected: false });
      const updatedReservations = reservations.filter(
        (res) => res.id !== reservationId
      );
      const confirmedReservation = { ...reservation, confirmed: true, rejected: false };
      setReservations(updatedReservations);
      setConfirmedReservations([...confirmedReservations, confirmedReservation]);
      setRemainingQuota(newRemaining);
      setNewOrdersCount(
        updatedReservations.filter(
          (r) => r.date === currentDate
        ).length
      );
      toast.success("تم تأكيد طلب العميل بنجاح!", {
        position: "top-right",
        autoClose: 2000,
      });
    } else {
      toast.error("لا يوجد كمية كافية في الحصة اليومية!", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleRejectReservation = async (reservationId) => {
    const reservationRef = doc(db, "reservations", reservationId);
    await updateDoc(reservationRef, { confirmed: false, rejected: true });
    const updatedReservations = reservations.filter(
      (res) => res.id !== reservationId
    );
    const rejectedReservation = reservations.find((res) => res.id === reservationId);
    setReservations(updatedReservations);
    setConfirmedReservations([...confirmedReservations, { ...rejectedReservation, confirmed: false, rejected: true }]);
    setNewOrdersCount(
      updatedReservations.filter(
        (r) => r.date === currentDate
      ).length
    );
    toast.error("تم رفض الطلب!", { position: "top-right", autoClose: 2000 });
  };

  const sidebarLinks = [
    { path: "/over-view", text: "نظرة عامة" },
    { path: "/orders", text: "الطلبات", count: newOrdersCount },
    { path: "/order-history", text: "سجل الطلبات" },
  ];

  const showOrders = location.pathname === "/orders";
  const showOrderHistory = location.pathname === "/order-history";

  const calculateQuotaPercentage = () => {
    return dailyQuota > 0 ? (remainingQuota / dailyQuota) * 100 : 0;
  };

  const quotaPercentage = calculateQuotaPercentage();

  return (
    <div
      className="dashboard"
      style={{ display: "flex", height: "100vh", backgroundColor: "#F5F1E8" }}
    >
      <div
        className="sidebar"
        style={{
          width: "250px",
          backgroundColor: "#4A2C2A",
          color: "#fff",
          padding: "20px",
        }}
      >
        <div className="sidebar-header">
          <h5
            className="sidebar-title"
            style={{ fontSize: "1.5rem", fontFamily: "Aref Ruqaa" }}
          >
            لوحة التحكم
          </h5>
        </div>
        <ul className="sidebar-nav" style={{ listStyle: "none", padding: 0 }}>
          {sidebarLinks.map((link) => (
            <li className="nav-item mb-2" key={link.path}>
              <Link
                className={`sidebar-link ${
                  location.pathname === link.path ? "active" : ""
                }`}
                to={link.path}
                style={{
                  display: "block",
                  color: "#fff",
                  textDecoration: "none",
                  padding: "10px",
                  fontFamily: "Aref Ruqaa",
                }}
              >
                <span>{link.text}</span>
                {link.count && (
                  <span
                    style={{
                      backgroundColor: "#D99A2B",
                      borderRadius: "50%",
                      padding: "2px 8px",
                      marginLeft: "10px",
                    }}
                  >
                    {link.count}
                  </span>
                )}
              </Link>
            </li>
          ))}
          <li className="nav-item mb-2">
            <button
              className="sidebar-link logout-btn"
              onClick={handleLogout}
              style={{
                width: "100",
                background: "none",
                border: "none",
                color: "#fff",
                textAlign: "left",
                padding: "10px",
                fontFamily: "Aref Ruqaa",
              }}
            >
              تسجيل الخروج
            </button>
          </li>
        </ul>
      </div>

      <div
        className="main-content"
        style={{
          flex: 1,
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "15px",
          margin: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <h5
          className="dashboard-title w-50 header-bg mt-5"
          style={{
            color: "#4A2C2A",
            fontSize: "2rem",
            fontFamily: "Aref Ruqaa",
            textAlign: "center",
            width: "80%",
            marginBottom: "40px",
          }}
        >
          {location.pathname === "/over-view"
            ? "نظرة عامة"
            : location.pathname === "/orders"
            ? "الطلبات"
            : "سجل الطلبات"}
        </h5>
        {location.pathname === "/over-view" && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
              width: "100%",
            }}
          >
            <div
              className="stat-column col-md-4"
              style={{
                backgroundColor: "#FDFAF6",
                borderRadius: "10px",
                padding: "15px",
                textAlign: "center",
              }}
            >
              <div
                className="column-title"
                style={{ color: "#6B4E31", fontSize: "1.5rem" }}
              >
                الحصة اليومية
              </div>
              <div
                className="stat-item"
                style={{ fontSize: "1.5rem", color: "#D99A2B" }}
              >
                {dailyQuota} رغيف
              </div>
            </div>

            <div
              className="stat-column col-md-4"
              style={{
                backgroundColor: "#FDFAF6",
                borderRadius: "10px",
                padding: "15px",
                textAlign: "center",
              }}
            >
              <div
                className="column-title"
                style={{ color: "#6B4E31", fontSize: "1.5rem" }}
              >
                المتبقي
              </div>
              <div
                className="stat-item"
                style={{
                  fontSize: "1.5rem",
                  color: remainingQuota > 0 ? "#D99A2B" : "#dc3545",
                }}
              >
                {remainingQuota > 0
                  ? `${remainingQuota} رغيف`
                  : "تم نفاذ الحصة اليومية"}
              </div>
            </div>

            <div
              className="stat-column col-md-4"
              style={{
                backgroundColor: "#FDFAF6",
                padding: "15px",
                borderRadius: "10px",
                textAlign: "center",
              }}
            >
              <div
                className="column-title"
                style={{ color: "#6B4E31", fontSize: "1.5rem" }}
              >
                نسبة الإنتاج
              </div>
              <div className="progress-container" style={{ marginTop: "10px" }}>
                <p
                  style={{
                    fontSize: "1.2rem",
                    color: "#4A2C2A",
                    textAlign: "center",
                  }}
                >
                  {Math.round(quotaPercentage)}%
                </p>
                <div
                  className="progress-bar-wrapper"
                  style={{
                    height: "20px",
                    backgroundColor: "#E0E0E0",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="progress-bar"
                    style={{
                      height: "100%",
                      width: `${quotaPercentage}%`,
                      background:
                        "linear-gradient(90deg, #E0B243 0%, #D99A2B 100%)",
                      borderRadius: "10px",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {showOrders && (
          <div
            className="orders-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
              justifyContent: "center",
              alignItems: "center",
              height: "80vh",
              width: "60%",
            }}
          >
            {reservations.filter(
              (res) =>
                !res.confirmed && !res.rejected && res.date === currentDate
            ).length > 0 ? (
              reservations
                .filter(
                  (res) =>
                    !res.confirmed && !res.rejected && res.date === currentDate
                )
                .map((res) => (
                  <div
                    key={res.id}
                    style={{
                      backgroundColor: "#FDFAF6",
                      padding: "15px",
                      borderRadius: "10px",
                      textAlign: "center",
                      width: "300px",
                      color: "#6B4E31",
                    }}
                  >
                    <div style={{ fontSize: "1.5rem" }}>
                      <span style={{ color: "#eab148ff" }}>اسم العميل:</span> {" "}
                      {res.user || "غير محدد"}
                    </div>
                    <div style={{ fontSize: "1.5rem" }}>
                       <span style={{ color: "#eab148ff" }}>اسم المخبز:</span>
                        {res.bakery || "غير محدد"}
                    </div>
                    <div style={{ fontSize: "1.5rem" }}>
                       <span style={{ color: "#eab148ff" }}>رقم البطاقه :</span>
                        {res.card_id || "غير محدد"}
                    </div>
                    <div style={{ fontSize: "1.5rem" }}>
                       <span style={{ color: "#eab148ff" }}>التاريخ :</span>
                       {res.date}
                    </div>
                    <div style={{ fontSize: "1.5rem" }}>
                       <span style={{ color: "#eab148ff" }}>الكميه :</span>
                     {res.quantity} رغيف
                    </div>
                    <div style={{ fontSize: "1.5rem" }}>
                       <span style={{ color: "#eab148ff" }}> الوقت:</span>
                      {res.time}</div>
                    <div
                      style={{
                        marginTop: "10px",
                        fontSize: "1.5rem",
                        color: "#6B4E31",
                        backgroundColor: "#FFDFB3",
                        padding: "5px 10px",
                        borderRadius: "5px",
                      }}
                    >
                      قيد المراجعة
                    </div>
                    <div
                      style={{
                        fontSize: "1.2rem",
                        marginTop: "5px",
                        color: res.delivered ? "#28a745" : "#6B4E31",
                      }}
                    >
                      {res.delivered ? "تم التوصيل" : "لم يتم التوصيل"}
                    </div>
                    {!res.confirmed && !res.rejected && (
                      <div style={{ marginTop: "10px" }}>
                        <button
                          onClick={() => handleConfirmReservation(res.id)}
                          style={{
                            backgroundColor: "#28a745",
                            color: "#fff",
                            border: "none",
                            padding: "5px 10px",
                            borderRadius: "5px",
                            marginRight: "10px",
                            marginLeft: "10px",
                          }}
                        >
                          تأكيد
                        </button>
                        <button
                          onClick={() => handleRejectReservation(res.id)}
                          style={{
                            backgroundColor: "#dc3545",
                            color: "#fff",
                            border: "none",
                            padding: "5px 10px",
                            borderRadius: "5px",
                          }}
                        >
                          رفض
                        </button>
                      </div>
                    )}
                  </div>
                ))
            ) : (
              <div
                style={{
                  textAlign: "center",
                  color: "#d64931ff",
                  fontSize: "2rem",
                  height: "100%",
                  marginRight:'50%',
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                لا يوجد طلبات اليوم
              </div>
            )}
          </div>
        )}
       {showOrderHistory && (
          <div
            className="orders-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
              justifyContent: "center",
              alignItems: "center",
              height: "80vh",
              width: "60%",
              overflow:'scroll'
            }}
          >
            {reservations.length > 0 ? (
              reservations.map((res) => (
                <div
                  key={res.id}
                  style={{
                    backgroundColor: "#FDFAF6",
                    padding: "15px",
                    borderRadius: "10px",
                    textAlign: "center",
                    width: "300px",
                    color: "#6B4E31",
                  }}
                >
                 <div style={{ fontSize: "1.5rem" }}>
                      <span style={{ color: "#eab148ff" }}>اسم العميل:</span> {" "}
                      {res.user || "غير محدد"}
                    </div>
                    <div style={{ fontSize: "1.5rem" }}>
                       <span style={{ color: "#eab148ff" }}>اسم المخبز:</span>
                        {res.bakery || "غير محدد"}
                    </div>
                    <div style={{ fontSize: "1.5rem" }}>
                       <span style={{ color: "#eab148ff" }}>رقم البطاقه :</span>
                        {res.card_id || "غير محدد"}
                    </div>
                    <div style={{ fontSize: "1.5rem" }}>
                       <span style={{ color: "#eab148ff" }}>التاريخ :</span>
                       {res.date}
                    </div>
                    <div style={{ fontSize: "1.5rem" }}>
                       <span style={{ color: "#eab148ff" }}>الكميه :</span>
                     {res.quantity} رغيف
                    </div>
                    <div style={{ fontSize: "1.5rem" }}>
                       <span style={{ color: "#eab148ff" }}> الوقت:</span>
                      {res.time}</div>
                  <div
                    style={{
                      marginTop: "10px",
                      fontSize: "1.2rem",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      backgroundColor: res.confirmed
                        ? "#D4EAD2"
                        : "#FFDFB3",
                    }}
                  >
                    {res.confirmed
                      ? "تم تأكيد الطلب"
                      : "قيد المراجعة"}
                  </div>
                  <div
                    style={{
                      fontSize: "1.2rem",
                      marginTop: "5px",
                      color: res.delivered ? "#28a745" : "#6B4E31",
                    }}
                  >
                    {res.delivered ? "تم التوصيل" : "لم يتم التوصيل"}
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  textAlign: "center",
                  color: "#6B4E31",
                  fontSize: "1.5rem",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                لا يوجد طلبات في السجل
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;