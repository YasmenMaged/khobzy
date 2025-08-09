import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Signup from './pages/Signup.jsx';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Reservations from './pages/Reservations.jsx';
import Login from './pages/Login.jsx';
import BakerySignup from './pages/BakerySignUp.jsx';
import UserTypeSelection from './pages/UserTypeSelection.jsx';
import { UserContextProvider } from './context/UserContext.js';
import Logout from './pages/Logout.jsx';
import Profile from './pages/Profile.jsx';
import ReservationHistory from './pages/ReservationHistory.jsx';

function AppContent() {
  const location = useLocation();
  const hideNavFooterRoutes = ['/signup', '/login', '/bakerysignup']; 
   const hideFooterRoutes=['/dashboard','/over-view','/orders','/order-history'];
  const hideNavFooter = hideNavFooterRoutes.includes(location.pathname);
  const hideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <>
      {!hideNavFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/choose-role" element={<UserTypeSelection />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/bakerysignup" element={<BakerySignup />} />
        <Route path="/login" element={<Login />} />
       
        <Route path="/over-view" element={<Dashboard />} />
        <Route path="/orders" element={<Dashboard />} />
        <Route path="/order-history" element={<Dashboard />} />
        <Route path="/production" element={<Dashboard />} />
        <Route path="/reservation" element={<Reservations />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reservation-history" element={<ReservationHistory />} />
      </Routes>
      {!hideFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </UserContextProvider>
  );
}

export default App;