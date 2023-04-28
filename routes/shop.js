const express = require("express");
const routes = express.Router();
const productController = require("../controllers/product");

routes.get("/", productController.getProducts);

module.exports = routes;
