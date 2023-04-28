const express = require("express");
const routes = express.Router();
const productController = require("../controllers/product");

//both have same routes name(/admin/product) but method is different so filtered
routes.get("/add-product", productController.getAddProduct);
routes.post("/add-product", productController.postAddProduct);

module.exports = routes;
