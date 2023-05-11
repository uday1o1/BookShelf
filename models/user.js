const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  //defing cart schema associated with each user
  cart: {
    products: [
      {
        //_id already set prod_id
        title: {
          type: String,
          //tell mongoose prod_id has name which is name from "Product" collection
          ref: "Product",
          require: true,
        },
        qty: { type: Number, require: true },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
  },
});

//define mongoose schema methods
//need to be function() so this referes to schema else separate function instance made
userSchema.methods.addProdToCart = function (product) {
  //model for single cart product(made separate to have no redundance with multiple _id data)
  let cartProduct = {
    _id: product._id,
    title: product.title,
    qty: 0,
  };
  //before finding using _id object convert to js string to avoid error
  //here this.cart is not just schema structure but populated cart instance
  const cartProductIndex = this.cart.products.findIndex((prod) => {
    return prod._id.toString() === product._id.toString();
  });

  let newCartProducts;
  //index not "-1" if product already added to cart so update qty
  if (cartProductIndex === -1) {
    //new product added to cart
    cartProduct.qty = 1;
    newCartProducts = [...this.cart.products, cartProduct];
  } else {
    //update qty
    cartProduct.qty = this.cart.products[cartProductIndex].qty + 1;
    this.cart.products[cartProductIndex] = cartProduct;
    newCartProducts = [...this.cart.products];
  }
  //update total price(works same for both add new/old product to cart)
  const newTotalPrice = this.cart.totalPrice + product.price;
  const newCart = {
    products: [...newCartProducts],
    totalPrice: newTotalPrice,
  };
  //replace oldCart with newCart(made of newCartProducts and newTotalPrice)
  this.cart = newCart;
  //save user instance which now has the updated cart
  //need to return as "then" block needs a returned response
  return this.save();
};

userSchema.methods.deleteProdFromCart = function (product) {
  //find index of prod to be deleted in cart
  const cartProductIndex = this.cart.products.findIndex((prod) => {
    return prod._id.toString() === product._id.toString();
  });

  console.log(cartProductIndex);

  //has array of cart products
  let newCartProducts = [...this.cart.products];
  console.log("prevCart", newCartProducts);
  //store qty of prod to be deleted from deleted of data(for subtracting from totalPrice)
  const qtyOfDeletedProd = this.cart.products[cartProductIndex].qty;

  newCartProducts.splice(cartProductIndex, 1);
  console.log("newCart", newCartProducts);
  const newTotalPrice = this.cart.totalPrice - product.price * qtyOfDeletedProd;
  const newCart = {
    products: [...newCartProducts],
    totalPrice: newTotalPrice,
  };

  this.cart = newCart;
  //save user instance which now has the updated cart
  //need to return as "then" block needs a returned response
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart.products = [];
  this.cart.totalPrice = 0;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
