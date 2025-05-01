import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function AdminPanel({ token }) {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState('');
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [filteredStats, setFilteredStats] = useState(null);
  const [filters, setFilters] = useState({ service: '', from: '', to: '' });

  const fetchServices = async () => {
    const res = await axios.get('http://localhost:5000/services');
    setServices(res.data);
  };

  const fetchStats = async () => {
    const res = await axios.get('http://localhost:5000/bookings/admin/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setStats(res.data);
  };

  const fetchChartAndStatsWithFilters = async () => {
    const res = await axios.get('http://localhost:5000/bookings', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const grouped = {};
    let total = 0;
    let popular = '';
    const serviceCount = {};

    res.data.forEach(b => {
      const name = b.service_id?.name || 'Unknown';
      const date = new Date(b.date_time);
      const includeByDate = (!filters.from || new Date(filters.from) <= date) && (!filters.to || date <= new Date(filters.to));
      const includeByService = !filters.service || b.service_id?.name === filters.service;
      if (includeByDate && includeByService) {
        if (!grouped[name]) grouped[name] = 0;
        grouped[name] += 1;

        if (!serviceCount[name]) serviceCount[name] = 0;
        serviceCount[name]++;
        total++;
      }
    });

    const data = Object.entries(grouped).map(([name, count]) => ({ name, count }));
    setChartData(data);

    if (total > 0) {
      popular = Object.entries(serviceCount).sort((a, b) => b[1] - a[1])[0][0];
    }

    setFilteredStats({ totalBookings: total, mostPopularService: popular || 'N/A' });
  };

  const applyFilters = () => {
    fetchChartAndStatsWithFilters();
  };

  const addService = async () => {
    if (!newService.trim()) return;
    try {
      await axios.post('http://localhost:5000/services', { name: newService }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✅ Service added successfully.');
      setNewService('');
      fetchServices();
    } catch (err) {
      setMessage('❌ Failed to add service.');
    }
  };

  const deleteService = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✅ Service deleted.');
      fetchServices();
    } catch (err) {
      setMessage('❌ Failed to delete service.');
    }
  };

  useEffect(() => {
    fetchServices();
    fetchStats();
    fetchChartAndStatsWithFilters();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-indigo-700">🛠 Admin Dashboard</h2>
        
      </div>

      {message && <div className="mb-4 text-sm text-green-600 font-medium">{message}</div>}

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          value={newService}
          onChange={e => setNewService(e.target.value)}
          placeholder="New service name"
          className="flex-1 border px-4 py-2 rounded-lg shadow-sm"
        />
        <button
          onClick={addService}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          ➕ Add Service
        </button>
      </div>

      <ul className="mb-6">
        {services.map(service => (
          <li key={service._id} className="flex justify-between items-center border-b py-2">
            <span className="text-gray-800">{service.name}</span>
            <button onClick={() => deleteService(service._id)} className="text-sm text-red-500 hover:underline">🗑 Delete</button>
          </li>
        ))}
      </ul>

      {filteredStats && (
        <div className="mt-6 p-4 bg-indigo-50 rounded-md">
          <h3 className="text-md font-semibold text-indigo-700 mb-2">📊 Filtered Stats</h3>
          <p>Total Bookings: <strong>{filteredStats.totalBookings}</strong></p>
          <p>Most Popular Service: <strong>{filteredStats.mostPopularService}</strong></p>
        </div>
      )}

      {chartData.length > 0 && (
        <div className="mt-6">
          <h3 className="text-md font-semibold text-indigo-700 mb-2">📈 Popular Services</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="mt-6">
        <h3 className="font-semibold text-indigo-700 mb-2">🔍 Filter Bookings</h3>
        <div className="flex gap-4 flex-wrap">
          <select
            value={filters.service}
            onChange={(e) => setFilters({ ...filters, service: e.target.value })}
            className="border px-2 py-1 rounded"
          >
            <option value="">All Services</option>
            {services.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
          </select>
          <input
            type="date"
            value={filters.from}
            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
            className="border px-2 py-1 rounded"
          />
          <input
            type="date"
            value={filters.to}
            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
            className="border px-2 py-1 rounded"
          />
          <button onClick={applyFilters} className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">Apply</button>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
