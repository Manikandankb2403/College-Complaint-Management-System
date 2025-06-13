import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}</h1>
      <p>Role: {user.role}</p>
      <p>Position: {user.position}</p>
      {user.role === 'admin' && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Admin Actions</h2>
          <p>Manage faculty and complaints.</p>
        </div>
      )}
      {user.role === 'faculty' && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Faculty Actions</h2>
          <p>View assigned complaints.</p>
        </div>
      )}
      {user.role === 'student' && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Student Actions</h2>
          <p>Submit and view your complaints.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;