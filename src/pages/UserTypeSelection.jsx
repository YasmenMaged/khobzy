import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const UserTypeSelection = () => {
  const navigate = useNavigate();
  const { setUserType } = useUser();

  const handleSelection = (type) => {
    setUserType(type); // Store the user type in context
    if (type === "citizen") navigate("/signup");
    else if (type === "owner") navigate("/bakerysignup");
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        height: "100vh",
        backgroundColor: "#f9f5f1",
        fontFamily: "Cairo, sans-serif",
        direction: "rtl",
      }}
    >
      <div className="container text-center">
        <h2 className="mb-4" style={{ color: "#4A2C2A" }}>
          اختر نوع المستخدم
        </h2>
        <div className="row justify-content-center gap-4">
          <div
            className="col-md-4 card shadow p-4"
            style={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              cursor: "pointer",
              border: "2px solid #E0B243",
              transition: "transform 0.2s",
            }}
            onClick={() => handleSelection("citizen")}
          >
            <h4 style={{ color: "#4A2C2A" }}>مواطن</h4>
            <p className="text-muted">التسجيل كمواطن للحصول على الخبز</p>
          </div>

          <div
            className="col-md-4 card shadow p-4"
            style={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              cursor: "pointer",
              border: "2px solid #D9A321",
              transition: "transform 0.2s",
            }}
            onClick={() => handleSelection("owner")}
          >
            <h4 style={{ color: "#4A2C2A" }}>صاحب مخبز</h4>
            <p className="text-muted">التسجيل كمخبز لإدارة الحجز والتوزيع</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelection;