const express = require("express")
const app = express();

const mongoose = require("mongoose")
const Mongo_URL = "mongodb://127.0.0.1:27017/wanderlust";

const Listing = require("./models/listing")
const path = require("path");
const methodOverride = require("method-override");


app.set("view engine", "ejs");
app.set("views", path.join (__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));


main().then(() =>{
    console.log("Databse connected succesfully")
})
.catch((err) =>{
    console.log(err)
})

async function main() {
    await mongoose.connect(Mongo_URL)
    
}


let port = 3000;
app.listen(port,(req,res) =>{
    console.log(`Server Run on ${port}`)
})


app.get("/", (req,res) =>{
    res.send("hee");
})

app.get("/listings", async(req, res)  => {
    const allList = await Listing.find({})
        res.render("listings/index.ejs",{allList}); 
 });

 //Create new route

 app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs"); 
});

//Post rout
app.post("/listings" , async (req,res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing");
    console.log("Data Was Added")
});


//Edit Route

app.get("/listings/:id/edit", async(req,res) => {
    let {id} = req.params;  
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs" , {listing});
})

//Update Route

app.put("/listings/:id", async(req,res) => {
    let {id} = req.params; 
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  res.redirect(`/listings/${id}`)

})


//Delete route

app.delete("/listings/:id", async(req,res) => {
    let {id} = req.params; 
  let deletlist = await Listing.findByIdAndDelete(id, {...req.body.listing});
  console.log(deletlist)
  res.redirect(`/listings`)

})


//Show Route

app.get("/listings/:id",async (req,res) => {
    let {id} = req.params;  
    id = id.trim(); 
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs" ,{listing})

 })





// app.get("/testListing", async (req, res) => {
//     try {
//         let setListing = new Listing({
//             title: "my new Guest House",
//             description: "Book your room and enjoy your vacation",
//             price: 5482,
//             location: "Cooch Behar",
//             country: "India"
//         });

//         const result = await setListing.save();
//         console.log(result, "Information was Saved!");
//         res.send("Listing saved successfully!");
//     } catch (err) {
//         console.error("Error saving listing:", err);
//         res.status(500).send("Failed to save listing.");
//     }
// });
