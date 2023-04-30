const fs = require("fs");
const path = require("path");
const mainDir = require("../util/mainDir");
const generateUniqueId = require("generate-unique-id");

const prodPath = path.join(mainDir, "data", "products.json");

const Cart = require("../models/cart");

//function for reading product json file and sending data in callback
const readProdFile = (cb) => {
  fs.readFile(prodPath, (err, fileContent) => {
    let products = [];
    //if err then file must be not exhisting so push empty array else parse data
    if (!err) {
      products = JSON.parse(fileContent);
    }
    return cb(products);
  });
};

module.exports = class Product {
  //'this' will have current product instance
  constructor(prodId, title, imageUrl, price, description) {
    this.prodId = prodId;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  //return whole product array(not single instance)
  static fetchProducts(cb) {
    readProdFile(cb);
  }

  //for fetching specific product instance based on given prodId, product return inside cb func
  static fetchProduct(prodId, cb) {
    readProdFile((products) => {
      const fetchedProd = products.find((product) => product.prodId === prodId);
      cb(fetchedProd);
    });
  }

  //save product(add or update)
  save() {
    //save file process only starts when product array received from callback of read func
    readProdFile((products) => {
      let newProducts = [];

      //if prodId exists then, updates all other attributes
      if (this.prodId) {
        //has index of edited product
        const prodIndex = products.findIndex(
          (product) => product.prodId === this.prodId
        );

        newProducts = [...products];
        //replace old product with new product instance
        newProducts[prodIndex] = this;
      }
      //if prodId doesn't exist then, make new and push to products array
      else {
        //generate unique product id for each product instance
        this.prodId = generateUniqueId();
        newProducts = [...products, this];
      }

      fs.writeFile(prodPath, JSON.stringify(newProducts), (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  }

  static delete(prodId, prodPrice) {
    readProdFile((products) => {
      const prodIndex = products.findIndex(
        (product) => product.prodId === prodId
      );

      let newProducts = [...products];
      //will remove one product at prodIndex
      newProducts.splice(prodIndex, 1);

      fs.writeFile(prodPath, JSON.stringify(newProducts), (err) => {
        if (err) {
          console.log(err);
        } else {
          //no error so, delete product from cart aswell
          Cart.deleteCartProduct(prodId, prodPrice);
        }
      });
    });
  }
};