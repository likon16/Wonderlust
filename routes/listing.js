
const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema} = require("../schema.js");
const ExpressErr = require("../utils/ExpressErr.js");
const Listing = require("../models/listing.js");



const validateListing = (req, res, next) => {
  const {error} = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressErr(msg, 400);
  }
  next();
};

// All listings
router.get("/", wrapAsync(async (req, res) => {
  const allList = await Listing.find({});
  res.render("listings/index.ejs", { allList });
}));

// New form
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Show single listing
router.get("/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
if (!listing){
  req.flash("error", "Listing not found!");
  return res.redirect("/listings");
}
  res.render("listings/show.ejs", { listing });
}));


// Create route
router.post("/", validateListing,wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "Successfully created a new listing!");

    res.redirect("/listings");
  }));
  

// Edit form
router.get("/:id/edit", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing){
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
}));

// Update listing
router.put("/:id", validateListing,wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, req.body.listing);
  req.flash("success", "Successfully updated your listing!");
  res.redirect(`/listings/${id}`);
}));

// Delete listing
router.delete("/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const del = await Listing.findByIdAndDelete(id);
  console.log("Deleted Listing", del);
  req.flash("success", "Successfully deleting listing!");
  res.redirect("/listings");
}));

module.exports = router;
