const express = require('express');
const router = express.Router({mergeParams: true}); // mergeParams allows us to access params from the parent route
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressErr = require("../utils/ExpressErr.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { validateReview, isLoggedIn ,isReviewAuthor} = require("../middleware.js");







  // post Reviews routes

router.post("/", isLoggedIn,validateReview, async (req, res, next) => {
    try {
      const listing = await Listing.findById(req.params.id);

       let newReview = new Review(req.body.review); 
      newReview.author=req.user.id;
      console.log("New Review", newReview);
      listing.reviews.push(newReview);
  
      await newReview.save();
      await listing.save();
      req.flash("success", "created a new review!");
  
      res.redirect(`/listings/${listing._id}`);
    } catch (err) {
      next(err);
    }
  });
  
  
  //delete review route
  router.delete("/:reviewId",isReviewAuthor,isLoggedIn, wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted the review!");
     
    res.redirect(`/listings/${id}`);
  }));



module.exports = router;

