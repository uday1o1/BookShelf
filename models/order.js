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

// userSchema.methods.createOrder = function () {
//     const orderCart = {
//       products: this.cart.products,
//       totalPrice: this.cart.totalPrice,
//       user_id: this._id,
//     };

//     const db = getDb();
//     //to add all products to order with all prod data use getCart func that maps all data
//     return this.getCart()
//       .then((productsWithData) => {
//         //give userId who placed order(to track in order collection)
//         const orderCart = {
//           products: productsWithData,
//           totalPrice: this.cart.totalPrice,
//           user_id: this._id,
//         };
//         //to create order need to save order in db and update user.cart(reset products and totalPrice)
//         return db.collection("orders").insertOne(orderCart);
//       })
//       .then((result) => {
//         //reset cart(after order placed and data stored in db)
//         this.cart.products = [];
//         this.cart.totalPrice = 0;
//         return db
//           .collection("users")
//           .updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: { cart: this.cart } }
//           );
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };
