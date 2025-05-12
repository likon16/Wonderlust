const Listing = require("../models/listing.js");

//Index Route

module.exports.index=async (req, res) => {
  const allList = await Listing.find({});
  res.render("listings/index.ejs", { allList });
}

//Render New Form
module.exports.renderNewForm =  (req, res) => {
  console.log(req.user);
    res.render("listings/new.ejs");
}



//Create new Listing

module.exports.createListing=async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;

  console.log(url,"...",filename)
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success", "Successfully created a new listing!");

    res.redirect("/listings");
  }

  //Show listing 

module.exports.showListing = async (req, res) => {
  
  const { id } = req.params;
  
  const listing = await Listing.findById(id).populate({
    path: "reviews",
    populate: { path: "author" } // This allows list.author.username to work
  }).populate("owner");
 // should now show the user details

if (!listing){
  req.flash("error", "Listing not found!");
  return res.redirect("/listings");
}
console.log(listing);
  res.render("listings/show.ejs", { listing });
}


//Edit listing

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing){
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  let originalImg = listing.image.url;
  originalImg = originalImg.replace("/upload", "/upload/h_300,w_250");
  res.render("listings/edit.ejs", { listing,originalImg });
}


//Update Listing 

  module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
   let listing= await Listing.findByIdAndUpdate(id, req.body.listing);
   if(typeof req.file !== 'undefined'){
 let url = req.file.path;
  let filename = req.file.filename;
  listing.image = {url,filename};
  await listing.save();
   }
     
    req.flash("success", "Successfully updated your listing!");
    res.redirect(`/listings/${id}`);
  
  }


  //Delete listing 

  module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    const del = await Listing.findByIdAndDelete(id);
    console.log("Deleted Listing", del);
    req.flash("success", "Successfully deleting listing!");
    res.redirect("/listings");
  }


  
module.exports.searchListings = async (req, res) => {
  const { q, category } = req.query;

  let filter = {};
  if (category && q) {
    filter[category] = { $regex: q, $options: "i" }; // Filter based on category and search term
  }

  // Get listings that match the filter
  const listings = await Listing.find(filter);

  // Render the view with listings and the search parameters
  res.render("listings/index", { allList: listings, category, q });
};



// Show Rate

module.exports.showRate = async (req, res) => {
  const allList = await Listing.find({}).populate("reviews").lean();

  allList.forEach((listing) => {
    if (listing.reviews.length) {
      const total = listing.reviews.reduce((acc, r) => acc + r.rating, 0);
      listing.avgRating = (total / listing.reviews.length).toFixed(1); // Keep 1 decimal
    } else {
      listing.avgRating = null;
    }
  });

  res.render("listings/index.ejs", { allList });
};







