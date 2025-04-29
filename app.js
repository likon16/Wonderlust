// Cleaned and working version of app.js

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const Listing = require("./models/listing");
const wrapAsync = require("./utills/wrapAsync");
const ExpressErr = require("./utills/ExpressErr");

const app = express();
const Mongo_URL = "mongodb://127.0.0.1:27017/wanderlust";

// DB connection
async function main() {
  try {
    await mongoose.connect(Mongo_URL);
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection error:", err);
  }
}
main();

// App config
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json()); // Required to parse JSON bodies


// Root route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Show all listings
app.get("/listings", wrapAsync(async (req, res) => {
  const allList = await Listing.find({});
  res.render("listings/index.ejs", { allList });
}));

// New listing form
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Create listing
app.post("/listings", wrapAsync(async (req, res) => {
    // Validate listing data
     if (!req.body.listing) {
        throw new ExpressErr("Invalid Listing Data", 400);
     }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  }));
  

// Edit listing form
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

// Update listing
app.put("/listings/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
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
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
}));

// Catch-all for invalid routes
app.all(/.*/, (req, res, next) => {
    next(new ExpressErr("Page Not Found", 404));

  });
// Global error handler


app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    const message = err.message || "Something went wrong!";
    res.status(status).send(`Error ${status}: ${message}`);
  });
  

  
// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
