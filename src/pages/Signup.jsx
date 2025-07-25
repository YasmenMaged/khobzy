import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import mockUsers from "../modules/mock_users.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addUser, getUser } from "../modules/registeredUsers";
import "../styles/auth.css";

const governoratesData = {
  القاهرة: ["المعادي", "مصر الجديدة", "مدينة نصر", "حلوان", "الساحل", "شبرا"],
  الجيزة: ["الهرم", "العمرانية", "بولاق الدكرور", "الوراق", "البدرشين", "أوسيم"],
  الإسكندرية: ["سيدي جابر", "العجمي", "محرم بك", "المنتزه", "الجمرك", "برج العرب"],
  الدقهلية: ["المنصورة", "طلخا", "ميت غمر", "دكرنس", "منية النصر"],
  الشرقية: ["الزقازيق", "بلبيس", "العاشر من رمضان", "أبو كبير", "فاقوس"],
  الغربية: ["طنطا", "كفر الزيات", "المحلة الكبرى", "زفتى", "سمنود"],
  المنوفية: ["شبين الكوم", "منوف", "السادات", "أشمون", "سرس الليان"],
  الفيوم: ["الفيوم", "إطسا", "سنورس", "طامية", "أبشواي"],
  "بني سويف": ["بني سويف", "الواسطى", "ناصر", "الفشن", "ببا"],
  المنيا: ["المنيا", "مطاي", "بني مazar", "ملوي", "أبو قرقاص"],
  أسيوط: ["أسيوط", "ديروط", "القوصية", "أبوتيج", "منفلوط"],
  سوهاج: ["سوهاج", "طهطا", "جرجا", "المراغة", "البلينا"],
  قنا: ["قنا", "دشنا", "نجع حمادي", "قفط", "أبوتشت"],
  الأقصر: ["الأقصر", "الزينية", "البياضية", "أرمنت", "إسنا"],
  أسوان: ["أسوان", "كوم أمبو", "دراو", "إدفو", "نصر النوبة"],
  السويس: ["السويس", "عتاقة", "الجناين", "الأربعين"],
  بورسعيد: ["بورفؤاد", "حي الزهور", "حي المناخ", "حي الشرق"],
  الإسماعيلية: ["الإسماعيلية", "التل الكبير", "فايد", "القنطرة شرق", "القنطرة غرب"],
};

const Signup = () => {
  const [districts, setDistricts] = useState([]);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      nationalId: "",
      email: "",
      password: "",
      phone: "",
      governorate: "",
      district: "",
      village: "",
    },
    validationSchema: Yup.object({
      nationalId: Yup.string()
        .matches(/^[0-9]{14}$/, "يجب أن يكون الرقم القومي مكونًا من 14 رقمًا")
        .required("مطلوب"),
      email: Yup.string().email("صيغة بريد إلكتروني غير صحيحة").required("مطلوب"),
      password: Yup.string()
        .min(6, "كلمة السر يجب أن تكون 6 أحرف على الأقل")
        .matches(/[A-Z]/, "يجب أن تحتوي على حرف كبير واحد على الأقل")
        .matches(/[!@#$%^&*(),.?\":{}|<>]/, "يجب أن تحتوي على رمز خاص واحد على الأقل")
        .required("مطلوب"),
      phone: Yup.string()
        .matches(/^01[0125][0-9]{8}$/, "رقم الهاتف غير صالح")
        .required("مطلوب"),
      governorate: Yup.string().required("مطلوب"),
      district: Yup.string().required("مطلوب"),
      village: Yup.string(),
    }),
    onSubmit: (values) => {
      const normalizedPhone = values.phone.trim();
      const normalizedNationalId = values.nationalId.trim();

      // Check if user exists in mock_users.json
      const existingUser = mockUsers.citizens.find(
        (citizen) =>
          citizen.phone === normalizedPhone &&
          citizen.national_id === normalizedNationalId
      );

      if (existingUser) {
        navigate("/");
      } else {
        // Prepare new user object with the exact password entered
        const newUser = {
          role: "citizen",
          name: "New Citizen", // Placeholder, update as needed
          national_id: normalizedNationalId,
          phone: normalizedPhone,
          password: values.password, // Use exact password entered
          email: values.email,
          governorate: values.governorate,
          district: values.district,
          village: values.village || "",
        };

        // Add user to localStorage
        const { success, message } = addUser(newUser);
        if (success) {
          const user = getUser(normalizedPhone, values.password);
          if (user) {
            navigate("/");
          } else {
            toast.error("فشل في التحقق من المستخدم بعد التسجيل");
          }
        } else {
          toast.error(message);
        }
      }
    },
  });

  const handleGovernorateChange = (e) => {
    const selected = e.target.value;
    formik.setFieldValue("governorate", selected);
    formik.setFieldValue("district", "");
    setDistricts(governoratesData[selected] || []);
  };

  const getFieldError = (field) =>
    formik.touched[field] && formik.errors[field] ? (
      <div className="text-danger small">{formik.errors[field]}</div>
    ) : null;

  return (
    <div className="d-flex flex-column flex-md-row" style={{ minHeight: "100vh", direction: "rtl" }}>
      {/* Form section */}
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
          <h2 className="text-center mb-4" style={{ color: "#4A2C2A", fontFamily: "Aref Ruqaa" }}>
            إنشاء حساب خبزي
          </h2>
          <form onSubmit={formik.handleSubmit} noValidate>
            {["nationalId", "email", "password", "phone"].map((field) => (
              <div className="mb-3" key={field}>
                <label htmlFor={field} className="form-label" style={{ color: "#2E1C1A" }}>
                  {{
                    nationalId: "الرقم القومي",
                    email: "البريد الإلكتروني",
                    password: "كلمة السر",
                    phone: "رقم التليفون",
                  }[field]}
                </label>
                <input
                  type={field === "password" ? "password" : "text"}
                  id={field}
                  name={field}
                  className="form-control"
                  style={{ backgroundColor: "#E5E5E5" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values[field]}
                />
                {getFieldError(field)}
              </div>
            ))}
            <div className="mb-3">
              <label htmlFor="governorate" className="form-label" style={{ color: "#2E1C1A" }}>
                المحافظة
              </label>
              <select
                id="governorate"
                name="governorate"
                className="form-select custom-select"
                style={{ backgroundColor: "#E5E5E5" }}
                onChange={handleGovernorateChange}
                onBlur={formik.handleBlur}
                value={formik.values.governorate}
              >
                <option value="">اختر محافظة</option>
                {Object.keys(governoratesData).map((gov) => (
                  <option key={gov} value={gov}>{gov}</option>
                ))}
              </select>
              {getFieldError("governorate")}
            </div>
            <div className="mb-3">
              <label htmlFor="district" className="form-label" style={{ color: "#2E1C1A" }}>
                المركز
              </label>
              <select
                id="district"
                name="district"
                className="form-select custom-select"
                style={{ backgroundColor: "#E5E5E5" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.district}
                disabled={!formik.values.governorate}
              >
                <option value="">اختر مركز</option>
                {districts.map((dist) => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
              {getFieldError("district")}
            </div>
            <div className="mb-3">
              <label htmlFor="village" className="form-label" style={{ color: "#2E1C1A" }}>
                القرية (اختياري)
              </label>
              <input
                type="text"
                id="village"
                name="village"
                className="form-control"
                style={{ backgroundColor: "#E5E5E5" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.village}
              />
              {getFieldError("village")}
            </div>
            <button type="submit" className="btn w-100 mt-3" style={{ backgroundColor: "#E0B243", color: "#FFFFFF", fontSize: "18px" }}>
              تسجيل
            </button>
            <p className="mt-3 text-center">
              لديك حساب بالفعل؟ {" "}
              <a href="/login" style={{ color: "#E0B243", textDecoration: "underline" }}>
                تسجيل الدخول
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* Image section */}
      <div className="w-100 w-md-50 d-flex align-items-center justify-content-center p-3">
        <div style={{ maxHeight: "90vh", overflow: "hidden" }}>
          <img
            src={require('../assets/login1.avif')}
            alt="bread"
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "90vh",
              objectFit: "cover",
            }}
          />
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Signup;