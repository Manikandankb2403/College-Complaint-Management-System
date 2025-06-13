import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await axios.post('https://college-complaint-management-system-99w0.onrender.com/api/auth/forgot-password', { email });
      setSuccess(res.data.message || 'Password reset email sent. Check your inbox.');
      setEmail('');
      setTimeout(() => navigate('/login'), 3000); // Redirect to login after 3s
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter your email"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Send Reset Email
        </button>
      </form>
      <p className="mt-4">
        Remembered your password? <Link to="/login" className="text-blue-500 hover:underline">Login here</Link>
      </p>
      <p>
        New user? <Link to="/register-student" className="text-blue-500 hover:underline">Register</Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
