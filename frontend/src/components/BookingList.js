import React, { useState } from 'react';
import axios from 'axios';

function BookingList({ bookings, token, fetchBookings, isAdmin }) {
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});

  const handleDelete = async (id) => {
    console.log("🧨 Calling DELETE /bookings/" + id);
  
    if (!token) {
      console.error("❌ No token available");
      return;
    }
  
    try {
      await axios.delete(`http://localhost:5000/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("✅ Delete request sent");
      fetchBookings();
    } catch (err) {
      console.error("❌ Delete error:", err.response?.data || err.message);
    }
  };    

  const startEdit = (booking) => {
    setEditingId(booking._id);
    setEditedData({
      customer_name: booking.customer_name,
      address: booking.address,
      date_time: booking.date_time.slice(0, 16),
      service_id: booking.service_id?._id || ''
    });
  };

  const saveEdit = async (id) => {
    await axios.put(`http://localhost:5000/bookings/${id}`, editedData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setEditingId(null);
    fetchBookings();
  };

  return (
    <div className="mt-6 bg-white shadow rounded-xl p-4">
      <h2 className="text-xl font-semibold text-indigo-700 mb-4">Your Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-gray-500 text-sm">No bookings found.</p>
      ) : (
        <ul className="space-y-3">
          {bookings.map(b => (
            <li key={b._id} className="bg-white border border-gray-200 shadow hover:shadow-md transition p-4 rounded-lg">
            {editingId === b._id ? (
              <div className="space-y-2">
                <input
                  value={editedData.customer_name}
                  onChange={(e) => setEditedData({ ...editedData, customer_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
                <input
                  value={editedData.address}
                  onChange={(e) => setEditedData({ ...editedData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
                <input
                  type="datetime-local"
                  value={editedData.date_time}
                  onChange={(e) => setEditedData({ ...editedData, date_time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
                <div className="flex gap-2 mt-2">
                  <button onClick={() => saveEdit(b._id)} className="text-sm text-green-600 hover:underline">💾 Save</button>
                  <button onClick={() => setEditingId(null)} className="text-sm text-gray-600 hover:underline">✖ Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="text-md font-semibold text-indigo-700">{b.customer_name}</h3>
                  <span className="text-sm bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
                    {b.service_id?.name || 'Unknown'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">📍 {b.address}</p>
                <p className="text-sm text-gray-600">🕒 {new Date(b.date_time).toLocaleString()}</p>
                <div className="flex gap-3 mt-3">
                  <button onClick={() => startEdit(b)} className="text-sm text-blue-600 hover:underline">✏️ Edit</button>
                  <button onClick={() => handleDelete(b._id)} className="text-sm text-red-600 hover:underline">🗑 Delete</button>
                </div>
              </>
            )}
          </li>           
          ))}
        </ul>
      )}
    </div>
  );
} 

export default BookingList; 