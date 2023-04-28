const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  //sending page title and path to inject in engine and also rendering add-product temp file
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

exports.postAddProduct = (req, res, next) => {
  const prod = new Product(req.body.title);
  prod.save();
  //reditect to home page
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  //callback implemented by sending code to render products which will only execute when the fetchProds func has
  //already fetched data and has sent to the callback func as aruements which are rendered
  Product.fetchProducts((products) => {
    //send products array to inject in ejs template
    res.render("shop", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};
