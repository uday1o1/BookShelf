const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  //callback implemented by sending code to render products which will only execute when the fetchProds func has
  //already fetched data and has sent to the callback func as aruements which are rendered
  Product.fetchProducts((products) => {
    //send products array to inject in ejs template
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

exports.getCart = (req, res, next) => {
  res.render("shop/cart", {
    pageTitle: "My Shopping Cart",
    path: "/cart",
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "My Orders",
    path: "/orders",
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchProducts((products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
