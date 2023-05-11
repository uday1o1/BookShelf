const mongoose = require("mongoose");

//define new mongoose scheme instance
//can define type and other attributes
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    //tell mongoose user_id has mongo object_id which is _id from "User" collection
    ref: "User",
    required: true,
  },
});

//instead of exporting Product class
//export custom Product model throught mongoose,
//which has the defined schema set
//mongoose also creates a new "products" collection
module.exports = mongoose.model("Product", productSchema);
