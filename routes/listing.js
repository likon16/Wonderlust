
const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })


const { isLoggedIn,isOwner,validateListing } = require("../middleware.js");


//Controlers

const listingController = require("../controllers/listing.js");

router.route("/")
.get(wrapAsync(listingController.index))
// .post(isLoggedIn,validateListing,wrapAsync(listingController.createListing));

.post(upload.single('listing[image][url]'),(req,res) => {
   console.log(req.file);
   console.log("File uploaded");

})

// New form
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner, validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));


//Index Route
// router.get("/", wrapAsync(listingController.index));



// Show single listing
// router.get("/:id", wrapAsync(listingController.showListing));


// Create route
// router.post("/", isLoggedIn,validateListing,wrapAsync(listingController.createListing));
  

// Edit form
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

// Update listing
// router.put("/:id",isLoggedIn,isOwner, validateListing,wrapAsync(listingController.updateListing));


// Delete listing
// router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;
