const fs = require("fs");
const path = require("path");
const mainDir = require("../util/mainDir");
const generateUniqueId = require('generate-unique-id');


const prodPath = path.join(mainDir, "data", "products.json");

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
  constructor(title, imageURL, price, description) {
    this.title = title;
    this.imageURL = imageURL;
    this.price = price;
    this.description = description;
    //generate unique product id for each product instance
    this.prodId = generateUniqueId();
  }

  //push product to array
  save() {
    //save file process only starts when product array received from callback of read func
    readProdFile((products) => {
      products.push(this);
      //push js string as json string
      fs.writeFile(prodPath, JSON.stringify(products), (err) => {
        if(err) {
          console.log(err);
        }
      });
    });
  }

  //return whole product array(not single instance)
  static fetchProducts(cb) {
    readProdFile(cb);
  }

  //for fetching specific product instance based on given prodId, product return inside cb func
  static fetchProduct(prodId, cb) {
    readProdFile((products) => {
      const fetchedProd = products.find(product => product.prodId === prodId);
      cb(fetchedProd)
    })
  }
};
