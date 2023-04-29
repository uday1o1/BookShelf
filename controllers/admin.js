const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  //sending page title and path to inject in engine and also rendering add-product temp file
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product"
  });
};

exports.postAddProduct = (req, res, next) => {
  let title = req.body.title;
  let imageURL = req.body.imageURL;
  let price = req.body.price;
  let description = req.body.description;

  //code just for testing:
  if(!title) {
    title = "An interesting book";
  }
  if(!imageURL) {
    imageURL = "https://pngimg.com/uploads/book/book_PNG2111.png";
  }
  if(!price) {
    price = "500";
  }
  if(!description) {
    description = "This is an amazing book";
  }

  const prod = new Product(title, imageURL, price, description);
  console.log(title, imageURL, price, description);
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