const mongoose = require("mongoose");
const Product = require("./product");

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

// userSchema.methods.getCart = function () {
//   //makes a mapped array of all prodIds inside user cart
//   const prodIds = this.cart.products.map((prod) => {
//     return prod._id;
//   });
//   //   let cartProds = []

//   Product.find({ _id: { $in: prodIds } }, function (err, cartProds) {
//     if (err) {
//       console.log(err);
//     }
//     return cartProds;
//   });

// const getDb = require("../util/database").getDb;
// const ObjectId = require("mongodb").ObjectId;
// const Product = require("./product");

// class User {
//   constructor(username, email, cart, _id) {
//     this.username = username;
//     this.email = email;
//     //every user has one cart(with array of products and totalPrice)
//     this.cart = cart;
//     this._id = _id;
//   }

//   saveUser() {
//     const db = getDb();
//     return db
//       .collection("users")
//       .insertOne(this)
//       .then((result) => {
//         console.log("user created");
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   static fetchUser(_id) {
//     const db = getDb();
//     //use findOne if always only single object will be returned
//     return db
//       .collection("users")
//       .findOne({ _id: new ObjectId(_id) })
//       .then((user) => {
//         console.log(user);
//         return user;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   getCart(product){
//   for(prod in this.cart.products) {
//     Product.findById(prod._id)
//     .then((product) => {
//         cartProds = [...cartProds, product]
//     })
//     .catch((err) => {
//         console.log(err)
//     })
//   }
//returns prod data from catalog of all prods in cart with an id from prodIds
//"$in" for find object whose _id is "in" prodIds
//after prods received iterate over each prod and,
//map each prod with the qty
//to find qty find prod with same _id as current iteration and,
//return matching prod whose qty used
//   this
//     .findById({ _id: { $in: prodIds } })
//     .then((user) => {

//       return user.cart.products.map((p) => {
//         return {
//           ...p,
//           qty: this.cart.products.find((i) => {
//             return i._id.toString() === p._id.toString();
//           }).qty,
//         };
//       });
//     });
// }

//   getCart() {
//
//   }

//   createOrder() {
//   }

//   getOrders() {
//     //need to find all orders from orders collecetion whose user_id matched that of person who ordered
//     const db = getDb();
//     return db.collection("orders").find({ user_id: new ObjectId(this._id) }).toArray();
//   }
// }

// module.exports = User;
