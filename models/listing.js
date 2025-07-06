

// const { string } = require("joi");
// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const listingSchema = new Schema({
//   title: String,
//   description: String,
//   image: {
//     url : String,
//     filename : String,
//   },
//   price: Number,
//   country :String,
//   location: String,
//   owner: {
//     type: Schema.Types.ObjectId,
//     ref: "User",
//     required: true
//   },
//   reviews: [
//     {
//       type: Schema.Types.ObjectId,
//       ref: "Review"
//     }
//   ]
// });

// const Listing = mongoose.model("Listing", listingSchema);
// module.exports = Listing;




const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    url: String,
    filename: String,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: [
      "Beach",
      "Mountains",
      "City",
      "Forest",
      "Island",
      "Adventure",
      "Camping",
      "Arctic",
      "Boats",
      "Heritage",
    ],
  },
  latitude: Number,
  longitude: Number,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;

