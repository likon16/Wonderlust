const mongoose = require("mongoose")
const Schema = mongoose.Schema;


const listingSchema = new Schema({
    title:{

        type : String,
        required :true
    } ,
    description:String,
    image:{ 
        type:String,
        default : "https://unsplash.com/photos/train-tracks-lead-to-a-view-of-mount-fuji-PIJel1qTrOY",
        Set :(v) => 
            v === "" ? "https://unsplash.com/photos/train-tracks-lead-to-a-view-of-mount-fuji-PIJel1qTrOY"
            :v,
    },
    price:Number,
    location:String,
    country : String
})

const Listing = mongoose.model("listing", listingSchema);
module.exports = Listing;