const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  //sending page title and path to inject in engine and also rendering add-product temp file
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product"
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imgURL = req.body.imgURL;
  const price = req.body.price;
  const bookInfo = req.body.bookInfo;

  const prod = new Product(title, imgURL, price, bookInfo);
  prod.save();
  //reditect to home page
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
    Product.fetchProducts((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products"
      });
    });
  };