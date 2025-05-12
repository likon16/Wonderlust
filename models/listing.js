const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const { required, string } = require("joi");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  
  image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      default: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?auto=format&fit=crop&w=800&q=60",
      set: (v) => v === "" ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?auto=format&fit=crop&w=800&q=60" : v
    }
  },  
  price: Number,
  location: String,
  country: String,
reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner:{
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
  type: String,
  enum: [
    "Trending",
    "Rooms",
    "Iconic Cities",
    "Mountains",
    "Castles",
    "Amazing Pools",
    "Camping",
    "Farms",
    "Arctic",
    "Doms",
    "Boats"
  ]
}

//   geomtry:{
//     type: {
//     type:String,
//     enum:["Point"],
//     required:true
//   },
//   coordinates:{
//     type:[Number],
//     required:true
//   },
// },
// category:{
//   type:String,
//   enum:["mountains","arctic","rooms","castles","trending","farms"]

// }


},{ timestamps: true });


listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await mongoose.model("Review").deleteMany({
      _id: {
        $in: listing.reviews, // ✅ correct reference
      },
    });
  }
 
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
