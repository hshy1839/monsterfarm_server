// models/Reservation.js
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // 사용자 참조
    required: true,
  },
  status: {
    type: String,
    enum: ['pending',  'completed'],
    default: 'pending',
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
  answer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer',
    required: true
  }
});

module.exports = mongoose.model('Reservation', reservationSchema);
