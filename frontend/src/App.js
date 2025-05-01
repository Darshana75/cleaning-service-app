import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthPage from './components/Login';
import BookingForm from './components/BookingForm';
import BookingList from './components/BookingList';
import AdminPanel from './components/AdminPanel';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    const res = await axios.get('http://localhost:5000/bookings', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const user = isAdmin ? res.data : res.data.filter(b => b.user_id?._id === userId);
    setBookings(user);
  };

  useEffect(() => {
    if (token) fetchBookings();
  }, [token]);

  useEffect(() => {
    console.log("isAdmin state:", isAdmin);
    console.log("localStorage isAdmin:", localStorage.getItem('isAdmin'));
  }, [isAdmin]);

  const handleLogout = () => {
    localStorage.clear();
    setToken('');
    setUserId('');
    setIsAdmin(false);
  };

  const effectiveAdmin = isAdmin || localStorage.getItem('isAdmin') === 'true';

  if (!token) {
    return <AuthPage setToken={setToken} setUserId={setUserId} setIsAdmin={setIsAdmin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-700">
            {effectiveAdmin ? 'Admin Panel' : 'User Dashboard'}
          </h1>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 underline hover:text-red-800 transition"
          >
            Logout
          </button>
        </div>

        {effectiveAdmin ? (
          <>
            <AdminPanel token={token} isAdmin={true} />
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-2 text-indigo-700">All Bookings</h2>
              <BookingList
  bookings={bookings}
  token={token}
  fetchBookings={fetchBookings}
  isAdmin={true}
/>
            </div>
          </>
        ) : (
          <>
            <BookingForm fetchBookings={fetchBookings} token={token} userId={userId} />
            <BookingList
  bookings={bookings}
  token={token}
  fetchBookings={fetchBookings}
  isAdmin={false}
/>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
