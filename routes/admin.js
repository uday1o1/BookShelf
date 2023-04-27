const express = require("express");
const routes = express.Router();
const path = require("path");
const rootDir = require("../util/path");

const products = [];

//adding routes with a section in from and filtering it in app.js
routes.get("/add-product", (req, res, next) => {
  //sending page title and path to inject in engine and also rendering add-product temp file, and boolean for loading css and active links
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
});
//both have same routes name(/admin/product) but method is different so filtered
routes.post("/add-product", (req, res, next) => {
  //express provides way to read parsed response body(can be of different types)
  products.push({ title: req.body.title });
  //easily redirect using express redirect func
  res.redirect("/");
});

//exporting both routes and product array
exports.routes = routes;
exports.products = products;
