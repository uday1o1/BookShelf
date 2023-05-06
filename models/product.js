const getDb = require("../util/database").getDb;
const ObjectId = require('mongodb').ObjectId; 


class Product {
  constructor(title, imageUrl, price, description) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  saveProduct() {
    const db = getDb();
    //db.collection creates products and accesses collection in db
    //insertOne to insert single product instance to db collection
    //return result got after inserting product to collection as when result got then,
    //we can continue pager render
    console.log(this);
    return db
      .collection("products")
      .insertOne(this)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static fetchAllProducts() {
    const db = getDb();
    //find return cursor to database bson file,
    //not the data
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        console.log(products);
        return products;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static fetchProduct(_id) {
    const db = getDb();
    //return product with specified _id
    //to give specific _id as it's special bson format id need to invoke objectId constructor
    //from mongoDb specially for _id attribute
    //find() returns cursor to traverse all prods received,
    // use next() to go to first(and here last also) prod in received data
    return db
      .collection("products")
      .find({_id: new ObjectId(_id)})
      .next()
      .then((product) => {
        console.log(product);
        return product;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
module.exports = Product;
