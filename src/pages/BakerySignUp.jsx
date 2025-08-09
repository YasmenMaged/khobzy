import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { addUser, getAllUsers, getBakerByNationalId, getBakeryByOwnerId, setBakeryData } from "../modules/registeredUsers.js";
import { useUser } from "../context/UserContext";

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
  المنيا: ["المنيا", "مطاي", "بني mazar", "ملوي", "أبو قرقاص"],
  أسيوط: ["أسيوط", "ديروط", "القوصية", "أبوتيج", "منفلوط"],
  سوهاج: ["سوهاج", "طهطا", "جرجا", "المراغة", "البلينا"],
  قنا: ["قنا", "دشنا", "نجع حمادي", "قفط", "أبوتشت"],
  الأقصر: ["الأقصر", "الزينية", "البياضية", "أرمنت", "إسنا"],
  أسوان: ["أسوان", "كوم أمبو", "دراو", "إدفو", "نصر النوبة"],
  السويس: ["السويس", "عتاقة", "الجناين", "الأربعين"],
  بورسعيد: ["بورفؤاد", "حي الزهور", "حي المناخ", "حي الشرق"],
  الإسماعيلية: ["الإسماعيلية", "التل الكبير", "فايد", "القنطرة شرق", "القنطرة غرب"],
};

const BakerySignup = () => {
  const navigate = useNavigate();
  const [districts, setDistricts] = useState([]);
  const { setUserData, setIsLoggedIn, setUserType } = useUser();

  const formik = useFormik({
    initialValues: {
      name: "",
      nationalId: "",
      phone: "",
      password: "",
      bakeryName: "",
      governorate: "",
      district: "",
      village: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("الاسم مطلوب"),
      nationalId: Yup.string()
        .matches(/^\d{14}$/, "يجب أن يكون الرقم القومي 14 رقمًا")
        .required("الرقم القومي مطلوب"),
      phone: Yup.string()
        .matches(/^\d{11}$/, "يجب أن يكون رقم الهاتف 11 رقمًا")
        .required("رقم الهاتف مطلوب"),
      password: Yup.string()
        .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
        .required("كلمة المرور مطلوبة"),
      bakeryName: Yup.string().required("اسم المخبز مطلوب"),
      governorate: Yup.string().required("المحافظة مطلوبة"),
      district: Yup.string().required("المركز مطلوب"),
      village: Yup.string(),
    }),
    onSubmit: async (values) => {
      const normalizedPhone = values.phone.trim();
      const normalizedNationalId = values.nationalId.trim();
      const normalizedPassword = values.password.trim();

      // التحقق من وجود الرقم القومي والهاتف معًا في registered_users
      const allUsers = await getAllUsers();
      const matchingUser = allUsers.find(u => u.phone === normalizedPhone && u.national_id === normalizedNationalId);
      if (matchingUser) {
        toast.info("لديك حساب بالفعل", {
          position: "top-right",
          autoClose: 2000,
        });
        setTimeout(() => navigate("/login"), 2500);
        return;
      }

      // التحقق من bakers
      const bakerData = await getBakerByNationalId(normalizedNationalId);
      let existingName = values.name;
      if (bakerData) {
        existingName = bakerData.name || values.name;
      }

      // إنشاء بيانات المخبز إذا لم تكن موجودة
      const bakeryData = await getBakeryByOwnerId(normalizedNationalId);
      let dailyQuota = 100;
      if (!bakeryData) {
        await setBakeryData(normalizedNationalId, {
          owners_national_id: normalizedNationalId,
          bakery_name: values.bakeryName,
          daily_quota: dailyQuota,
          remaining_quota: dailyQuota,
          last_reset_date: new Date().toISOString().split('T')[0],
        });
      } else {
        dailyQuota = bakeryData.daily_quota || 100;
      }

      const newUser = {
        role: "baker",
        name: existingName,
        national_id: normalizedNationalId,
        phone: normalizedPhone,
        password: normalizedPassword,
        bakery_name: values.bakeryName,
        governorate: values.governorate,
        district: values.district,
        village: values.village || "",
        location: `${values.district}, ${values.governorate}`,
        daily_quota: dailyQuota,
      };
      const { success, message } = await addUser(newUser);
      if (success) {
        setUserData(newUser);
        setIsLoggedIn(true);
        setUserType("owner");
        navigate("/over-view");
      } else {
        toast.error(message);
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
          <h2 className="text-center mb-4" style={{ color: "#D99A2B", fontFamily: "Aref Ruqaa" }}>
            تسجيل المخبز
          </h2>
          <form onSubmit={formik.handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="name" className="form-label" style={{color: "#2E1C1A"}}>الاسم</label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-control"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
              {getFieldError("name")}
            </div>
            <div className="mb-3">
              <label htmlFor="nationalId" className="form-label" style={{color: "#2E1C1A"}}>الرقم القومي</label>
              <input
                id="nationalId"
                name="nationalId"
                type="text"
                className="form-control"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.nationalId}
              />
              {getFieldError("nationalId")}
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label" style={{color: "#2E1C1A"}}>رقم الهاتف</label>
              <input
                id="phone"
                name="phone"
                type="text"
                className="form-control"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
              />
              {getFieldError("phone")}
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label" style={{color: "#2E1C1A"}}>كلمة المرور</label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-control"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {getFieldError("password")}
            </div>
            <div className="mb-3">
              <label htmlFor="bakeryName" className="form-label" style={{color: "#2E1C1A"}}>اسم المخبز</label>
              <input
                id="bakeryName"
                name="bakeryName"
                type="text"
                className="form-control"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.bakeryName}
              />
              {getFieldError("bakeryName")}
            </div>
            <div className="mb-3">
              <label htmlFor="governorate" className="form-label" style={{color: "#2E1C1A"}}>المحافظة</label>
              <select
                id="governorate"
                name="governorate"
                className="form-select custom-select"
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
              <label htmlFor="district" className="form-label" style={{color: "#2E1C1A"}}>المركز</label>
              <select
                id="district"
                name="district"
                className="form-select custom-select"
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
              <label htmlFor="village" className="form-label" style={{color: "#2E1C1A"}}>القرية (اختياري)</label>
              <input
                id="village"
                name="village"
                type="text"
                className="form-control"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.village}
              />
            </div>
            <button type="submit" className="btn w-100 mt-3" style={{ backgroundColor: "#E0B243", color: "#FFFFFF", fontSize: "18px" }}>
              تسجيل
            </button>
            <p className="mt-3 text-center">
              لديك حساب بالفعل? {" "}
              <a href="/login" style={{ color: "#E0B243", textDecoration: "underline" }}>
                تسجيل الدخول
              </a>
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

export default BakerySignup;