const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');

// ✅ GET all goals for a specific user
router.get('/', async (req, res) => {
  const { userId } = req.query; // Expect userId as a query parameter

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const goals = await Goal.find({ userId });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ POST: Create a new goal for a user
router.post('/', async (req, res) => {
   console.log('Incoming request body:', req.body); 

  const { userId, date, goal, cost, type } = req.body;

  if (!userId || !date || !goal || !cost || !type) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newGoal = new Goal({
    userId,
    date,
    goal,
    cost,
    type,
  });

  try {
    const savedGoal = await newGoal.save();
    res.status(201).json(savedGoal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ PUT: Update a goal
router.put('/:id', async (req, res) => {
   console.log("Incoming request:", req.params); // Log to check if `id` exists

  if (!req.params.id) {
    return res.status(400).json({ message: "Goal ID is required!" });
  }
  const { date, goal, cost, type } = req.body;

  try {
    const updatedGoal = await Goal.findByIdAndUpdate(
      req.params.id,
      { date, goal, cost, type },
      { new: true }
    );
    res.json(updatedGoal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ DELETE: Delete a goal
router.delete('/:id', async (req, res) => {
   console.log('DELETE /goals id:', req.params.id);

  try {
    await Goal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Goal deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
