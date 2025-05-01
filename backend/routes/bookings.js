const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const auth = require('../middleware');

// GET bookings 
router.get('/', auth, async (req, res) => {
  const user = await User.findById(req.userId);
  const query = user.isAdmin ? {} : { user_id: req.userId, deleted: { $ne: true } };
  const bookings = await Booking.find(query).populate('service_id').populate('user_id');
  res.json(bookings);
});

// POST booking
router.post('/', auth, async (req, res) => {
  const booking = new Booking(req.body);
  await booking.save();
  res.status(201).json(booking);
});

// PUT update booking
router.put('/:id', auth, async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  const user = await User.findById(req.userId);
  const isOwner = booking.user_id.toString() === req.userId;
  const isAdmin = user.isAdmin === true;

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ error: 'Unauthorized to update this booking' });
  }

  Object.assign(booking, req.body);
  await booking.save();
  res.json(booking);
});

// DELETE booking 
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json({ error: 'User not authenticated' });

    const isOwner = booking.user_id.toString() === req.userId;
    const isAdmin = user.isAdmin === true;

    if (!isOwner && !isAdmin) {
      console.log("❌ Rejected delete. Not owner or admin.");
      return res.status(403).json({ error: 'Unauthorized to delete this booking' });
    }

    booking.deleted = true;
    await booking.save();

    console.log(`✅ Booking ${booking._id} soft-deleted by ${user.username} (${isAdmin ? 'admin' : 'owner'})`);
    res.sendStatus(204);
  } catch (err) {
    console.error("❌ Error in DELETE /bookings/:id", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin stats
router.get('/admin/stats', auth, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user.isAdmin) return res.status(403).json({ error: 'Access denied' });

  const totalBookings = await Booking.countDocuments({ deleted: { $ne: true } });

  const mostPopular = await Booking.aggregate([
    { $match: { deleted: { $ne: true } } },
    { $group: { _id: '$service_id', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 }
  ]);

  const totalUsers = await User.countDocuments();

  res.json({
    totalBookings,
    mostPopularService: mostPopular[0]?._id || 'N/A',
    totalUsers
  });
});

module.exports = router;
