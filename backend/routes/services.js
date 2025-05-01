const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const auth = require('../middleware');

// GET all services
router.get('/', async (req, res) => {
  const services = await Service.find();
  res.json(services);
});

// CREATE service 
router.post('/', auth, async (req, res) => {
  const newService = new Service({ name: req.body.name });
  await newService.save();
  res.json(newService);
});

// DELETE service 
router.delete('/:id', auth, async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

// UPDATE service
router.put('/:id', auth, async (req, res) => {
  const updated = await Service.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  res.json(updated);
});

module.exports = router;
