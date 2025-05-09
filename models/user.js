const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportlocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({

  email: {
    type: String,
    required: true,
    unique: true,
  },
  
  // listings: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: "Listing",
  //   },
  // ],
});

userSchema.plugin(passportlocalMongoose);
const User = mongoose.model("User", userSchema);
module.exports = User;