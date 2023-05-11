const mongoose = require("mongoose");

//define new mongoose scheme instance
//can define type and other attributes
const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  products: [
    {
      type: Object,
      required: true,
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  date: { type: String, default: Date },
});

module.exports = mongoose.model("Order", orderSchema);
