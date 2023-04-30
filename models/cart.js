const fs = require("fs");
const path = require("path");
const mainDir = require("../util/mainDir");

const cartPath = path.join(mainDir, "data", "cart.json");

module.exports = class Cart {
  //each cart will have products and totalPrice, and each product in products will have prodId, prodQty
  static addProdToCart(prodId, prodPrice) {
    fs.readFile(cartPath, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      //if err then file must be not exhisting so push empty array else parse data
      if (!err) {
        cart = JSON.parse(fileContent);
      }

      //if product already in cart then increment qty else add product
      //find index of product using productId
      const oldProdIndex = cart.products.findIndex(
        (product) => product.prodId === prodId
      );

      let newProduct = { prodId: "", qty: 0 };

      //product not in cart, so make new cart product and add to previous data
      if (oldProdIndex === -1) {
        newProduct = { prodId: prodId, qty: 1 };

        //appending new product to cart using js spread
        cart.products = [...cart.products, newProduct];
      }
      //if product already in cart then make new product with same data but incremeneted qty,
      //and replace the product at updated product's index
      else {
        newProduct = { ...cart.products[oldProdIndex] };
        newProduct.qty = newProduct.qty + 1;
        cart.products = [...cart.products];

        //replacing oldProduct with newProduct
        cart.products[oldProdIndex] = newProduct;
      }

      //increase total price with price of added product(done once for each addToCart)
      const price = Number(prodPrice);
      cart.totalPrice = cart.totalPrice + price;

      //write back to json file
      fs.writeFile(cartPath, JSON.stringify(cart), (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  }

  static deleteCartProduct(prodId, prodPrice) {
    fs.readFile(cartPath, (err, fileContent) => {
      //if err then file must be not exhisting so push empty array else parse data
      if (!err) {
        const cart = JSON.parse(fileContent);

        //fetch index of delted cart product and splice
        let newCart = { ...cart };
        const prodIndex = newCart.products.findIndex(
          (product) => product.prodId === prodId
        );

        //if prodIndex is '-1' means product being deleted(admin) not in cart so,
        //no need to delete from cart only in main prodList(admin)
        if(prodIndex === -1) {
          return;
        }

        //decrease the total cart value(need product qty and price)
        const qty = newCart.products[prodIndex].qty;
        newCart.totalPrice -= qty * prodPrice;

        newCart.products.splice(prodIndex, 1);

        //if no product left in cart then totalPrice = 0
        if (newCart.products.length === 0) {
          newCart.totalPrice = 0;
        }

        fs.writeFile(cartPath, JSON.stringify(newCart), (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
    });
  }

  static fetchCart(cb) {
    //fetching all products from cart and sending as callback to func
    fs.readFile(cartPath, (err, fileContent) => {
      if (!err) {
        const cart = JSON.parse(fileContent);
        return cb(cart);
      } else {
        console.log(err);
      }
      return cb(err);
    });
  }
};
