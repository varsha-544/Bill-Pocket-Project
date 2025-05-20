const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // reference to the User
    required: true,
    ref: 'User',
  },
  date: {
    type: String,
    required: true,
  },
  goal: {
    type: String,
    required: true,
  },
  cost: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['short', 'long'],
    required: true,
  },
});

module.exports = mongoose.model('Goal', GoalSchema);
