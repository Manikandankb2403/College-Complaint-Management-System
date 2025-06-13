import { Routes, Route } from 'react-router-dom'; // ❌ Removed BrowserRouter
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import RegisterStudent from './pages/RegisterStudent';
import RegisterFaculty from './pages/RegisterFaculty';
import RegisterAdmin from './pages/RegisterAdmin';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import ComplaintForm from './pages/ComplaintForm';
import ComplaintList from './pages/ComplaintList';
import './index.css'; // Ensure Tailwind CSS is imported
function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register-student" element={<RegisterStudent />} />
            <Route path="/register-faculty" element={<RegisterFaculty />} />
            <Route path="/register-admin" element={<RegisterAdmin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/submit-complaint"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <ComplaintForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/complaints"
              element={
                <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
                  <ComplaintList />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
