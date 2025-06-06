const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer_name: { type: String, required: true },
  address: { type: String, required: true },
  date_time: { type: Date, required: true },
  service_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Booking', bookingSchema);
