const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  name: String,
  email: String,
  card: String,
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Reservation", reservationSchema);
