const express = require("express");
const routes = express.Router();
const path = require("path");

const adminRoute = require("../routes/admin");
const rootDir = require("../util/path");

//next to point to next middleware
routes.get("/", (req, res, next) => {
  const products = adminRoute.products;
  //send data(products) to inject in ejs template and also send active links
  //res.render("shop", {prods: products, pageTitle: "Shop", path: '/'});
  res.render("shop", {
    prods: products,
    pageTitle: "Shop",
    path: "/",
  });
});

module.exports = routes;
