const Product = require("../models/product");
const ObjectId = require("mongodb").ObjectId;

exports.getProducts = (req, res, next) => {
  Product.fetchAllProducts()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAddProduct = (req, res, next) => {
  //sending page title and path to inject in engine and also rendering add-product temp file
  res.render("admin/editProduct", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    //send null as true will populate form with product values
    editMode: null,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const user_id = req.user._id;

  const prod = new Product(title, imageUrl, price, description, null, user_id);
  prod
    .saveProduct()
    .then((result) => {
      //result only gotten when product object created and saved to db collection
      console.log("added new product to catalog");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  //fetching the productId of item to be eddited from url parameters
  const _id = req.params.prodId;
  //fetching query from url, which will be true if in editMode
  //query will be accessed from part of url after '?' as key:value pairs, where each query is separated by '&'
  const editMode = req.query.editMode;

  //editMode also sent so that form can have prevous product data preloaded for editing,
  //else new product so empty form
  //need to fetch product as it's attributes accessed to populate ejs form
  Product.fetchProduct(_id)
    .then((fetchedProduct) => {
      res.render("admin/editProduct", {
        pageTitle: "Edit Product",
        editMode: editMode,
        product: fetchedProduct,
        //sending empty path as it was being accessed in ejs file
        path: "",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const _id = req.body._id;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const user_id = req.user._id;

  const prod = new Product(title, imageUrl, price, description, _id, user_id);

  prod
    .saveProduct()
    .then((result) => {
      console.log("updated product in catalog");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const _id = req.body._id;
  //before deleting whole product need to delete it from cart first,
  //to delete, fetch the prod to be deleted(as it's price info is needed to update totalPrice) then,
  //deleted it from cart
  Product.fetchProduct(_id).then((product) => {
    req.user
      .deleteProdFromCart(product)
      .then(() => {
        console.log("product deleted from cart");
      })
      .then(() => {
        //deleted product from catalog
        Product.deleteProduct(_id);
      })
      .then(() => {
        console.log("deleted product from catalog");
        res.redirect("/admin/products");
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
