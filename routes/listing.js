const express = require("express");
const router = express.Router();

const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../until/wrapasync");
const { isLoggedIn, isOwner, validateListing, isReviewAuthor } = require("../middleware.js");
const review = require("../models/review");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


router
  .route("/")
  .get(wrapAsync(listingController.indexRoute))   //Index Route 
  .post(isLoggedIn, validateListing,upload.single("listing[image]"), wrapAsync(listingController.createRoute));   //Create Route
  

//New Route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});


router.get("/search", async (req, res) => {
  const { q } = req.query;

  if (!q) {
    req.flash("error", "Please enter a search query.");
    return res.redirect("/listings");
  }

  // Case-insensitive partial match on location
  const listings = await Listing.find({
    location: { $regex: q, $options: "i" },
  });

  res.render("listings/index", {
    allListings: listings,
    selectedCategory: null,
  });
});


router
  .route("/:id")
  .get(wrapAsync(listingController.showRoute))    //Show Route
  .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateRoute))    //Update Route
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroy));  //Delete Route




//Edit Route
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.editRoute));





module.exports = router;
