const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


module.exports.createReview = async (req, res, next) => {
    try {
      const listing = await Listing.findById(req.params.id);

       let newReview = new Review(req.body.review); 
      newReview.author=req.user.id; 
      console.log("New Review", newReview);
      listing.reviews.push(newReview);
  
      await newReview.save();
      await listing.save();
      req.flash("success", "Add review!");
  
      res.redirect(`/listings/${listing._id}`);
    } catch (err) {
      next(err);
    }
  }

  module.exports.destroyReview = async (req, res) => {
      const { id, reviewId } = req.params;
      await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
      await Review.findByIdAndDelete(reviewId);
      req.flash("success", "Successfully deleted review!");
       
      res.redirect(`/listings/${id}`);
    }