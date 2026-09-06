import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import FarmerDashboard from './pages/FarmerDashboard';
import FindCentres from './pages/FindCentres';
import BookSlot from './pages/BookSlot';
import Token from './pages/Token';
import Queue from './pages/Queue';
import Procurement from './pages/Procurement';
import Payments from './pages/Payments';
import Receipt from './pages/Receipt';
import History from './pages/History';
import Complaints from './pages/Complaints';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import OperatorDashboard from './pages/OperatorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/dashboard" element={<ProtectedRoute role="farmer"><FarmerDashboard /></ProtectedRoute>} />
          <Route path="/find-centres" element={<ProtectedRoute role="farmer"><FindCentres /></ProtectedRoute>} />
          <Route path="/book-slot" element={<ProtectedRoute role="farmer"><BookSlot /></ProtectedRoute>} />
          <Route path="/token" element={<ProtectedRoute role="farmer"><Token /></ProtectedRoute>} />
          <Route path="/queue" element={<ProtectedRoute role="farmer"><Queue /></ProtectedRoute>} />
          <Route path="/procurement" element={<ProtectedRoute role="farmer"><Procurement /></ProtectedRoute>} />
          <Route path="/payments" element={<ProtectedRoute role="farmer"><Payments /></ProtectedRoute>} />
          <Route path="/receipt" element={<ProtectedRoute role="farmer"><Receipt /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute role="farmer"><History /></ProtectedRoute>} />
          <Route path="/complaints" element={<ProtectedRoute role="farmer"><Complaints /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute role="farmer"><Profile /></ProtectedRoute>} />

          <Route path="/operator/dashboard" element={<ProtectedRoute role="operator"><OperatorDashboard /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
