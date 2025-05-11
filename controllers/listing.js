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
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
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
  res.render("listings/edit.ejs", { listing });
}


//Update Listing 

  module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
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
