import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../index.css'; // Ensure Tailwind CSS is imported
const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Complaint Portal</Link>
        <div className="space-x-4">
          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              {user.role === 'student' && <Link to="/submit-complaint">Submit Complaint</Link>}
              <Link to="/complaints">View Complaints</Link>
              <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register-student">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;