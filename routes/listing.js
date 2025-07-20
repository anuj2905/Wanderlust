const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../until/wrapasync");
const listingController = require("../controllers/listing.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const {
  isLoggedIn,
  isOwner,
  validateListing
} = require("../middleware.js");

// 🏠 Index & Create Listing
router.route("/")
  .get(wrapAsync(listingController.indexRoute)) // Show all listings
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createRoute)
  );

// ➕ New Listing Form
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

// 🔍 Search Listings by Location
router.get("/search", async (req, res) => {
  const { q } = req.query;
  if (!q) {
    req.flash("error", "Please enter a search query.");
    return res.redirect("/listings");
  }

  const listings = await Listing.find({
    location: { $regex: q, $options: "i" },
  });

  res.render("listings/index", {
    allListings: listings,
    selectedCategory: null,
  });
});

// 📃 Show, Edit, Update, Delete Listing
router.route("/:id")
  .get(wrapAsync(listingController.showRoute)) // Show Route
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateRoute)
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroy)
  );

// ✏️ Edit Listing Form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editRoute));

// 🧾 Booking Route (basic confirmation)
router.post("/:id/book", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  // You can add booking model or more details here
  req.flash("success", "Your booking is confirmed!");
  res.redirect(`/listings/${id}`);
});

module.exports = router;
