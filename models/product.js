const getDb = require("../util/database").getDb;
const ObjectId = require("mongodb").ObjectId;

class Product {
  constructor(title, imageUrl, price, description, _id, user_id) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = parseFloat(price);
    this.description = description;
    if (_id) {
      //object id being accessed should me bson object id
      this._id = new ObjectId(_id);
    }
    this.user_id = user_id;
  }

  saveProduct() {
    const db = getDb();
    //will have either new or update product object
    let prodUpdate;
    //db.collection creates products and accesses collection in db
    //insertOne to insert single product instance to db collection
    //return result got after inserting product to collection as when result got then,
    //we can continue pager render
    //_id null means create new prod(insertOne) and save else update prod(updateOne)
    if (!this._id) {
      prodUpdate = db.collection("products").insertOne(this);
    } else {
      //update need an attribute to find object in db,
      //and action when found(here "$set" to replace all prod attributes with new "this" instance)
      prodUpdate = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    }
    return prodUpdate
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
      .findOne({ _id: new ObjectId(_id) })
      .then((product) => {
        return product;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static deleteProduct(_id) {
    const db = getDb();
    //deleteOne func similar to update one func which take bson objectId
    return db
      .collection("products")
      .deleteOne({ _id: new ObjectId(_id) })
      .then((result) => {
        console.log("delteted product from catalog");
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
module.exports = Product;
