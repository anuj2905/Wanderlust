const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const revSchema = new Schema({
  comment: {
    type: String,
    required: true,
    trim: true // optional: trims whitespace
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now // ✅ Don’t call it (no parentheses)
  },
  author :{
    type : Schema.Types.ObjectId,
    ref : "User",
  },
});

module.exports = mongoose.model("Review", revSchema);
