const Listing = require("./models/listing.js");
const { listingSchema, reviewSchema} = require("./schema.js");
const ExpressErr = require("./utils/ExpressErr.js");
const Review = require("./models/review.js");



module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; // Store the original URL
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
}



module.exports.saveRedirectUrl = (req, res, next) => {
 if(req.session.redirectUrl ){
  res.locals.redirectUrl = req.session.redirectUrl; // Store the original URL
 } 
  next();
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listings");
  }

  // Use req.user._id instead of undefined currentUser
  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You do not have permission.");
    return res.redirect(`/listings/${id}`);
  }

  next();
};
module.exports.validateListing = (req, res, next) => {
  const {error} = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressErr(msg, 400);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body, { abortEarly: false });
  
    if (error) {
      const msg = error.details.map((el) => el.message).join(", ");
      throw new ExpressErr(msg, 400); // throws error to your global error handler
    }
  
    next();
  };


  module.exports.isReviewAuthor =async (req,res,next) =>{
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review){
      req.flash("error","Review not found");
      return res.redirect("/listings");
      }
      if(!review.author.equals(req.user._id)){
        req.flash("error","You do not own this review");
        return res.redirect(`/listings/${req.params.id}`);
        }
        next();
  }