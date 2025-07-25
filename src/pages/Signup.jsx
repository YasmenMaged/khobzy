import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import users from "../modules/mock_users.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  المنيا: ["المنيا", "مطاي", "بني مزار", "ملوي", "أبو قرقاص"],
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
        .matches(/[!@#$%^&*(),.?":{}|<>]/, "يجب أن تحتوي على رمز خاص واحد على الأقل")
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

      const isCitizen = users?.citizens?.some(
        (user) =>
          user.phone?.trim() === normalizedPhone &&
          user.national_id?.trim() === normalizedNationalId
      );

      if (!isCitizen) {
        toast.error("ليس لديك بطاقة تموينية", {
          position: "top-right",
        });
        return;
      }

      console.log(values);
      navigate("/");
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
    <div className="container-fluid" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <ToastContainer />
      <div className="row flex-grow-1 w-100 " >
        <div className="col-md-6 d-flex align-items-center justify-content-center" >
          <div className="w-100" style={{ maxWidth: "500px", height:"100vh",backgroundColor: "#fff", padding: "0px 40px 40px 40px", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
            <h1 className="text-center mb-1" style={{ color: "#4A2C2A", fontFamily: "Aref Ruqaa" }}>  إنشاء حساب خبزي</h1>
            <form onSubmit={formik.handleSubmit} noValidate>
              {["nationalId", "email", "password", "phone"].map((field) => (
                <div className="mb-1" key={field}>
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
              <div className="mb-1">
                <label htmlFor="governorate" className="form-label" style={{ color: "#2E1C1A" }}>
                  المحافظة
                </label>
                <select
                  id="governorate"
                  name="governorate"
                  className="form-select"
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
              <div className="mb-2">
                <label htmlFor="district" className="form-label" style={{ color: "#2E1C1A" }}>
                  المركز
                </label>
                <select
                  id="district"
                  name="district"
                  className="form-select"
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
              <button type="submit" className="btn w-100" style={{ backgroundColor: "#E0B243", color: "#FFFFFF", fontSize: "18px" }}>
                تسجيل
              </button>
              <p className="mt-1 mb-1 text-center">
                لديك حساب بالفعل؟ {" "}
                <a href="/login" style={{ color: "#E0B243", textDecoration: "underline" }}>
                  تسجيل الدخول
                </a>
              </p>
            </form>
          </div>
        </div>
        <div className="col-md-6 d-none d-md-block p-0 ">
          <img
            src={require('../assets/login1.avif')}
            alt="bread"
            style={{ width: '100%', height: '100%', maxHeight: '100vh', objectFit: 'contain' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
