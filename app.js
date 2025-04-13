const express = require("express")
const app = express();

const mongoose = require("mongoose")
const Mongo_URL = "mongodb://127.0.0.1:27017/wonderlust";

const Listing = require("./models/listing")



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
app.get("/testListing", async (req, res) => {
    try {
        let setListing = new Listing({
            title: "my new Guest House",
            description: "Book your room and enjoy your vacation",
            price: 5482,
            location: "Cooch Behar",
            country: "India"
        });

        const result = await setListing.save();
        console.log(result, "Information was Saved!");
        res.send("Listing saved successfully!");
    } catch (err) {
        console.error("Error saving listing:", err);
        res.status(500).send("Failed to save listing.");
    }
});
