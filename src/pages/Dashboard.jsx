import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/dashBoardStyle.css';
const Dashboard = () => {
  const orders = [
    { name: 'أحمد علي', time: '10:30 AM', quantity: 5 },
    { name: 'فاطمة محمد', time: '9:43 AM', quantity: 3 },
    { name: 'خالد عبد الله', time: '8:15 AM', quantity: 10 },
  ];

  return (
    <div className="container-fluid dashboard" dir="rtl">
      <div className="row ">
        <div className="col-md-2 dash-sidebar vh-100 p-3">
          <h5 className="mb-4">لوحة التحكم</h5>
          <ul className="nav flex-column">
            <li className="nav-item mb-2"><Link className="nav-link" to="#">نظرة عامة</Link></li>
            <li className="nav-item mb-2"><Link className="nav-link" to="#">الطلبات</Link></li>
            <li className="nav-item mb-2"><Link className="nav-link" to="#">سجل الطلبات</Link></li>
            <li className="nav-item mb-2"><Link className="nav-link" to="#">إدارة الإنتاج</Link></li>
          </ul>
        </div>

        <div className="col-md-10 p-4">
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="border rounded p-3 text-center">
                <h5>إعداد الطلبات اليوم</h5>
                <p>120</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="border rounded p-3 text-center">
                <h5>التغليف اليوم</h5>
                <p>25</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="border rounded p-3 text-center">
                <h5>الرغيف الباقي</h5>
                <p>50</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="border rounded p-3 text-center">
                <h5>الإشغال</h5>
                <p>75%</p>
              </div>
            </div>
          </div>

          <h5 className="mb-3">الطلبات الحالية</h5>
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>اسم العميل</th>
                <th>وقت الحجز</th>
                <th>الكمية</th>
                <th>حالة الطلب</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index}>
                  <td>{order.name}</td>
                  <td>{order.time}</td>
                  <td>{order.quantity}</td>
                  <td>محجوز</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4">
            <h5>سجل الطلبات</h5>
            <div className="form-group mt-3">
              <label htmlFor="production">كم رغيف هتنتج بكرة؟</label>
              <input type="number" className="form-control w-25" id="production" defaultValue="200" />
              <button className="btn btn-primary mt-2">تحديث</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
