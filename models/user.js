const getDb = require("../util/database").getDb;
const ObjectId = require("mongodb").ObjectId;
const Product = require("./product");

class User {
  constructor(username, email, cart, _id) {
    this.username = username;
    this.email = email;
    //every user has one cart(with array of products and totalPrice)
    this.cart = cart;
    this._id = _id;
  }

  saveUser() {
    const db = getDb();
    return db
      .collection("users")
      .insertOne(this)
      .then((result) => {
        console.log("user created");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static fetchUser(_id) {
    const db = getDb();
    //use findOne if always only single object will be returned
    return db
      .collection("users")
      .findOne({ _id: new ObjectId(_id) })
      .then((user) => {
        console.log(user);
        return user;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  addProdToCart(product) {

    //model for single cart product(made separate to have no redundance with multiple _id data)
    let cartProduct = {
      _id: product._id,
      qty: 0,
    };
    //before finding using _id object convert to js string to avoid error
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
    const db = getDb();
    return db
      .collection("users")
      .updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: newCart } })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = User;