
const express = require('express');
const router = express.Router();
const wrapAsync = require("../utills/wrapAsync");
const { listingSchema} = require("../schema");
const ExpressErr = require("../utills/ExpressErr");
const Listing = require("../models/listing");



const validateListing = (req, res, next) => {
  const {error} = listingSchema.validate(req.body);
// console.log("Validation",error);

  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressErr(msg, 400);
  }
  next();
};
// All listings
router.get("/",validateListing, wrapAsync(async (req, res) => {
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
  res.render("listings/show.ejs", { listing });
}));


// Create route
router.post("/", validateListing,wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  }));
  

// Edit form
router.get("/:id/edit", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

// Update listing
router.put("/:id", validateListing,wrapAsync(async (req, res) => {
  const { id } = req.params;
  
  
  await Listing.findByIdAndUpdate(id, req.body.listing);
  res.redirect(`/listings/${id}`);
}));

// Delete listing
router.delete("/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));

module.exports = router;
