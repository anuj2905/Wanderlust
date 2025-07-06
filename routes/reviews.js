//  reviews.js
const express = require("express");
const router = express.Router({ mergeParams: true }); 

const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../until/wrapasync");
const {validateReview, isLoggedIn ,isReviewAuthor}  = require("../middleware.js");
const reviewController = require("../controllers/review.js");


//  Create review
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.create));

// ✅ DELETE: Remove review
router.delete("/:reviewId",isReviewAuthor, wrapAsync(reviewController.destroy));

module.exports = router;



