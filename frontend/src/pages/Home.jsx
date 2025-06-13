import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../index.css'; // Ensure Tailwind CSS is imported
const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">
        Welcome to the College Complaint Portal
      </h1>
      <p className="text-lg mb-8">
        {user
          ? `Hello, ${user.name}! Manage your complaints and account from your dashboard.`
          : 'Submit and track your complaints easily. Login or register to get started!'}
      </p>
      <div className="space-x-4">
        {user ? (
          <>
            <Link
              to="/dashboard"
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
            >
              Go to Dashboard
            </Link>
            {user.role === 'student' && (
              <Link
                to="/submit-complaint"
                className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
              >
                Submit Complaint
              </Link>
            )}
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
            >
              Login
            </Link>
            <Link
              to="/register-student"
              className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;