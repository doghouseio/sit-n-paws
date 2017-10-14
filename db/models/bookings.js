var mongoose = require('mongoose');
var sitnpaws = require('../config')

//host listing schema
bookingSchema = new mongoose.Schema(
  {
    hostEmail: { type: String, required: true },
    guestEmail: { type: String, required: true },
    date: { type: String, required: true },
    confirmed: {type: Boolean, required: true}
  }
);

var booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;