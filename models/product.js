const fs = require("fs");
const path = require("path");
const mainDir = require("../util/mainDir");

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
  constructor(title, imgURL, price, bookInfo) {
    this.title = title;
    this.price = price;
    this.imgURL = imgURL;
    this.bookInfo = bookInfo;
  }

  //push product to array
  save() {
    //save file process only starts when product array received from callback of read func
    readProdFile((products) => {
      products.push(this);
      //push js string as json string
      fs.writeFile(prodPath, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  //return whole product array(not single instance)
  static fetchProducts(cb) {
    readProdFile(cb);
  }
};
