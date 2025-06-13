import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../index.css';
const ComplaintForm = () => {
  const [formData, setFormData] = useState({
    department: '',
    category: '',
    details: '',
  });
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/complaints', {
        deptNo: user.deptNo,
        username: user.name,
        ...formData,
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      navigate('/complaints');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Submit Complaint</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Department</option>
            <option value="IT">IT</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Category</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Academic">Academic</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Details</label>
          <textarea
            name="details"
            value={formData.details}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;