const mongoose = require('mongoose');

const StatementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Optional, for population if needed later
  },
  date: {
    type: String,
    required: true,
  },
  item: {
    type: String,
    required: true,
  },
  cost: {
    type: String,
    required: true,
  },
  note: { type: String },
});

module.exports = mongoose.model('Statement', StatementSchema);
