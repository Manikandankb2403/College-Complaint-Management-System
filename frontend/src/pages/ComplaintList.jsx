import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

const ComplaintList = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        let endpoint = '';
        if (user.role === 'student') {
          endpoint = '/complaints/user';
        } else if (user.role === 'faculty') {
          endpoint = '/complaints/faculty';
        } else if (user.role === 'admin') {
          endpoint = '/complaints';
        }

        const res = await api.get(endpoint);
        setComplaints(res.data.complaints || res.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load complaints');
        setLoading(false);
      }
    };

    if (user) {
      fetchComplaints();
    }
  }, [user]);

  if (loading) return <div className="container mx-auto p-4">Loading...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {user.role === 'student' ? 'My Complaints' : user.role === 'faculty' ? 'Assigned Complaints' : 'All Complaints'}
      </h1>
      {complaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Dept No</th>
                <th className="py-2 px-4 border">Department</th>
                <th className="py-2 px-4 border">Category</th>
                <th className="py-2 px-4 border">Details</th>
                <th className="py-2 px-4 border">Status</th>
                {user.role === 'admin' && <th className="py-2 px-4 border">Assigned To</th>}
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint._id}>
                  <td className="py-2 px-4 border">{complaint.deptNo}</td>
                  <td className="py-2 px-4 border">{complaint.department}</td>
                  <td className="py-2 px-4 border">{complaint.category}</td>
                  <td className="py-2 px-4 border">{complaint.details}</td>
                  <td className="py-2 px-4 border">{complaint.status}</td>
                  {user.role === 'admin' && (
                    <td className="py-2 px-4 border">
                      {complaint.assignedTo ? complaint.assignedTo.name : 'Unassigned'}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ComplaintList;