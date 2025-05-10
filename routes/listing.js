
const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const { isLoggedIn,isOwner,validateListing } = require("../middleware.js");


// All listings
router.get("/", wrapAsync(async (req, res) => {
  const allList = await Listing.find({});
  res.render("listings/index.ejs", { allList });
}));

// New form
router.get("/new",isLoggedIn, (req, res) => {
  console.log(req.user);
  // Check if user is authenticated before allowing access to the new listing form
    res.render("listings/new.ejs");
});

// Show single listing
router.get("/:id", wrapAsync(async (req, res) => {
  
  const { id } = req.params;
  
  const listing = await Listing.findById(id).populate({
    path: "reviews",
    populate: { path: "author" } // This allows list.author.username to work
  }).populate("owner");
 // should now show the user details

if (!listing){
  req.flash("error", "Listing not found!");
  return res.redirect("/listings");
}
console.log(listing);
  res.render("listings/show.ejs", { listing });
}));


// Create route
router.post("/", isLoggedIn,validateListing,wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Successfully created a new listing!");

    res.redirect("/listings");
  }));
  

// Edit form
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing){
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
}));

// Update listing
router.put("/:id",isLoggedIn,isOwner, validateListing,wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, req.body.listing);
  req.flash("success", "Successfully updated your listing!");
  res.redirect(`/listings/${id}`);

}));

// Delete listing
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const del = await Listing.findByIdAndDelete(id);
  console.log("Deleted Listing", del);
  req.flash("success", "Successfully deleting listing!");
  res.redirect("/listings");
}));

module.exports = router;
