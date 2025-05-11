const express = require('express');
const router = express.Router({mergeParams: true}); // mergeParams allows us to access params from the parent route
const wrapAsync = require("../utils/wrapAsync.js");


const { validateReview, isLoggedIn ,isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/review.js")

// post Reviews routes
router.post("/", isLoggedIn,validateReview, reviewController.createReview);
  
  
//delete review route
  router.delete("/:reviewId",isReviewAuthor,isLoggedIn, wrapAsync(reviewController.destroyReview));

module.exports = router;

