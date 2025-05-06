const express = require('express');
const router = express.Router({mergeParams: true}); // mergeParams allows us to access params from the parent route
const wrapAsync = require("../utils/wrapAsync.js");
const {  reviewSchema } = require("../schema.js");
const ExpressErr = require("../utils/ExpressErr.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");




const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body, { abortEarly: false });
  
    if (error) {
      const msg = error.details.map((el) => el.message).join(", ");
      throw new ExpressErr(msg, 400); // throws error to your global error handler
    }
  
    next();
  };

  // post Reviews routes

router.post("/", validateReview, async (req, res, next) => {
    try {
      const listing = await Listing.findById(req.params.id);
      if (!listing) {
        throw new ExpressErr("Listing not found", 404);
      }
  
      const newReview = new Review(req.body.review); 
      console.log("New Review", newReview);
      listing.reviews.push(newReview);
  
      await newReview.save();
      await listing.save();
  
      res.redirect(`/listings/${listing._id}`);
    } catch (err) {
      next(err);
    }
  });
  
  
  //delete review route
  router.delete("/:reviewId", wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  }));



module.exports = router;

