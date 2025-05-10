const mongoose = require("mongoose");
const { data: sampleListings } = require("./data");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  
  // Modify each object to add the owner field
  const listingsWithOwner = initData.data.map((obj) => ({
    ...obj,
    owner: "64f1b8c0d2a3e4f5b8c0d2a3"
  }));

  await Listing.insertMany(listingsWithOwner);
  console.log("Data was initialized");
};


initDB();