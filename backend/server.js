const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection
mongoose.connect('mongodb://localhost:27017/cleaningdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
const authRoute = require('./routes/auth');
const servicesRoute = require('./routes/services');
const bookingsRoute = require('./routes/bookings');

app.use('/auth', authRoute);
app.use('/services', servicesRoute);
app.use('/bookings', bookingsRoute); 

app.listen(5000, () => {
  console.log('🚀 Server running on http://localhost:5000');
}); 