

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressErr = require("./utils/ExpressErr");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const app = express();
const Mongo_URL = "mongodb://127.0.0.1:27017/wanderlust";
const session = require("express-session");
const flash = require("connect-flash");


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




app.get("/", (req, res) => {
  res.render("home.ejs");
}
);
// Session configuration
const sessionOptions = {
  secret: "secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 day
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true, 
    // secure: false, // Set to true if using HTTPS
  },
};

app.use(session(sessionOptions));
app.use(flash());


// Middleware for flash messages
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  console.log(res.locals.success);
  next();
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);




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
