const Listing = require("../models/listing.js");

module.exports.indexRoute = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.showRoute = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        }).populate("owner");
    console.log(listing);
    res.render("listings/show.ejs", { listing });
};

module.exports.createRoute = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "new request created!");
    res.redirect("/listings");

};

module.exports.editRoute = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("success", "request edited!");
        res.redirect("/listings");
    };  
    

    let orignalImageUrl = listing.image.url;
    
    orignalImageUrl = orignalImageUrl.replace("/upload", "/upload/h_300,w_250");

    res.render("listings/edit.ejs", { listing ,orignalImageUrl});
};


// module.exports.updateRoute = async (req, res) => {
//     let { id } = req.params;
//     let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

//     if(typeof req.file !==undefined){
//         let url = req.file.path;
//         let filename =req.file.filename;
//         listing.image= {url, filename};
//         await listing.save();
//     }
//     req.flash("success", " request updated!");
//     res.redirect(`/listings/${id}`);
// }

module.exports.updateRoute = async (req, res) => {
  const { id } = req.params;

  // Update main fields
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

  // ✅ Only update image if a new one was uploaded
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
    await listing.save(); // Save updated image
  }

  req.flash("success", "Request updated!");
  res.redirect(`/listings/${id}`);
};



module.exports.destroy = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", " request deleted!");
    res.redirect("/listings");
}




module.exports.indexRoute = async (req, res) => {
  const { category } = req.query;

  let filter = {};
  if (category) {
    filter.category = category;
  }

  const listings = await Listing.find(filter);

  res.render("listings/index", {
    allListings: listings,
    selectedCategory: category || null,
  });
};







