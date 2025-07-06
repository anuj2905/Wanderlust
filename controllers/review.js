const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


module.exports.create = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  const review = new Review(req.body.review);
  review.author = req.user._id; 
  
  listing.reviews.push(review);
  await review.save();
  await listing.save();

  req.flash("success", "Review added!");
  res.redirect(`/listings/${listing._id}`);
};


module.exports.destroy = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review deleted!");
  res.redirect(`/listings/${id}`);
}