const Listing = require("../models/listing");
const axios = require("axios");

// Helper: Get coordinates from OpenStreetMap Nominatim
async function getCoordinates(location) {
  const endpoint = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
  const response = await axios.get(endpoint, {
    headers: { "User-Agent": "WanderlustApp/1.0" },
  });

  if (response.data.length === 0) return null;
  const { lat, lon } = response.data[0];
  return {
    latitude: parseFloat(lat),
    longitude: parseFloat(lon),
  };
}

// Show all listings (optional category filter)
module.exports.indexRoute = async (req, res) => {
  const { category } = req.query;
  const filter = category ? { category } : {};
  const listings = await Listing.find(filter);
  res.render("listings/index", {
    allListings: listings,
    selectedCategory: category || null,
  });
};

// Show single listing
module.exports.showRoute = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  res.render("listings/show", { listing });
};

// Render New Listing Form
module.exports.newRoute = (req, res) => {
  res.render("listings/new");
};

// Create new listing
module.exports.createRoute = async (req, res) => {
  const { location } = req.body.listing;
  const coords = await getCoordinates(location);

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  if (coords) {
    newListing.latitude = coords.latitude;
    newListing.longitude = coords.longitude;
  }

  await newListing.save();
  req.flash("success", "New listing created!");
  res.redirect(`/listings/${newListing._id}`);
};

// Render Edit Form
module.exports.editRoute = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  const originalImageUrl = listing.image?.url?.replace("/upload", "/upload/h_300,w_250");
  res.render("listings/edit", { listing, originalImageUrl });
};

// Update existing listing
module.exports.updateRoute = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body.listing;

  // Check if category is still provided
  if (!updatedData.category) {
    req.flash("error", "Category is required!");
    return res.redirect(`/listings/${id}/edit`);
  }

  const listing = await Listing.findByIdAndUpdate(id, updatedData, { new: true });

  // If image uploaded, update image
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  // Re-fetch coordinates if location changed
  if (updatedData.location) {
    const coords = await getCoordinates(updatedData.location);
    if (coords) {
      listing.latitude = coords.latitude;
      listing.longitude = coords.longitude;
    }
  }

  await listing.save();
  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${listing._id}`);
};

// Delete listing
module.exports.destroy = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};
