import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Reservations from './pages/Reservations';
import Login from './pages/Login';
import BakerySignup from './pages/BakerySignUp';
import UserTypeSelection from './pages/UserTypeSelection';
import { UserContextProvider } from './context/UserContext';
import Logout from './pages/Logout';
import Profile from './pages/Profile';

function AppContent() {
const location = useLocation();
const hideNavFooterRoutes = ['/signup','/login','/bakerysignup']; // نقدر نضيف مسارات تانية هنا

const hideNavFooter = hideNavFooterRoutes.includes(location.pathname);

return (
<>
{!hideNavFooter && <Navbar />}
<Routes>
<Route path="/" element={<Home />} />
<Route path="/choose-role" element={<UserTypeSelection />} />
<Route path="/signup" element={<Signup />} />
<Route path="/bakerysignup" element={<BakerySignup/>} />
<Route path="/login" element={<Login />} />
<Route path="/dashboard" element={<Dashboard />} />
<Route path="/reservations" element={<Reservations />} />
<Route path="/logout" element={<Logout />} />
<Route path="/profile" element={<Profile />} />
</Routes>
{!hideNavFooter && <Footer />}
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

