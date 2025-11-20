if(process.env.NODE_ENV != "production")
{
require('dotenv').config()
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressErr = require("./utils/ExpressErr");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


// const Mongo_URL = "mongodb://127.0.0.1:27017/wanderlust";

const dbUrl = process.env.ATLASDB_URL;

const app = express();

const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");





// Database connection
mongoose.connect(dbUrl)
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




// Middleware to make `q` and `category` available in all views
app.use((req, res, next) => {
    res.locals.q = req.query.q || "";
    res.locals.category = req.query.category || "";
    next();
});



// app.get("/", (req, res) => {
//   res.render("home.ejs");
// }
// );



const store = MongoStore.create({
mongoUrl:dbUrl,
crypto:{
  secret: process.env.SECRET,
},
touchAfter:24*3600,
});

store.on("error",()=>{
  console.log("Error on Mongo Session Store",err)
})

// Session configuration
const sessionOptions = {
  store,
  secret: process.env.SECRET,
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

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

app.use((req, res, next) => {
    res.locals.currentUser = req.session.user || null;
    next();
});


// Serialize and deserialize user
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Middleware for flash messages
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  console.log(res.locals.success);
  next();
});

app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);





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
