const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const Listing = require("./models/listing");
const Review = require("./models/review");
const wrapAsync = require("./utills/wrapAsync");
const ExpressErr = require("./utills/ExpressErr");
const { listingSchema, reviewSchema } = require("./schema");

const app = express();
const Mongo_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Database connection
mongoose.connect(Mongo_URL)
  .then(() => {
    console.log(" Database connected successfully");
  })
  .catch(err => {
    console.error(" MongoDB connection error:", err);
  });

// App config
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// Root route
app.get("/", (req, res) => {
  res.send("Hello World!");
});


// joi validation middleware



const validateListing = (req, res, next) => {
  const {error} = listingSchema.validate(req.body);
// console.log("Validation",error);

  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressErr(msg, 400);
  }
  next();
};




let validateReview = (req, res, next) => {

  let { error } = reviewSchema.validate(req.body);
  console.log(error);
  if (error) {
      const msg = error.details.map((el) => el.message).join(",");
       throw new ExpressErr(msg, 400);
  }
  else {
      next();
  }
};
// All listings
app.get("/listings",validateListing, wrapAsync(async (req, res) => {
  const allList = await Listing.find({});
  res.render("listings/index.ejs", { allList });
}));

// New form
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Create listing with Joi validation
app.post("/listings", validateListing,wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));

// Edit form
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

// Update listing
app.put("/listings/:id", validateListing,wrapAsync(async (req, res) => {
  const { id } = req.params;
  // const { error } = listingSchema.validate(req.body);
  
  await Listing.findByIdAndUpdate(id, req.body.listing);
  res.redirect(`/listings/${id}`);
}));

// Delete listing
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));

// Show single listing
app.get("/listings/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  res.render("listings/show.ejs", { listing });
}));



// post Reviews routes
app.post("/listings/:id/reviews",validateReview,wrapAsync( async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(req.params.id);
  const newReview = new Review(req.body.review);

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  console.log("New Review", newReview);
  res.redirect(`/listings/${listing._id}`);
  // res.send("Review added successfully!");

 
}));





//delete review route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
}));



// Catch-all for undefined routes
app.all(/.*/, (req, res, next) => {
  next(new ExpressErr("Page Not Found", 404));
});

// Global error handler
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Something went wrong!";
  res.status(status).render("error.ejs", { message });
});

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
