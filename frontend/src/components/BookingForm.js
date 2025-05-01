import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BookingForm({ fetchBookings, token, userId }) {
  const [formData, setFormData] = useState({
    customer_name: '',
    address: '',
    date_time: '',
    service_id: ''
  });
  const [services, setServices] = useState([]);

  const fetchServices = async () => {
    const res = await axios.get('http://localhost:5000/services');
    setServices(res.data);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/bookings', { ...formData, user_id: userId }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchBookings();
    setFormData({ customer_name: '', address: '', date_time: '', service_id: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md space-y-4 border border-gray-100">
      <h2 className="text-2xl font-bold text-indigo-700 mb-2">📅 Book a Cleaning Service</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
          <input
            type="text"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-indigo-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-indigo-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
          <input
            type="datetime-local"
            name="date_time"
            value={formData.date_time}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-indigo-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
          <select
            name="service_id"
            value={formData.service_id}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-indigo-100"
          >
            <option value="">Select a service</option>
            {services.map(service => (
              <option key={service._id} value={service._id}>{service.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          🚀 Book Now
        </button>
      </div>
    </form>
  );
}

export default BookingForm; 