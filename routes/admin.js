const express = require("express");
const routes = express.Router();
const adminController = require("../controllers/admin");

//both have same routes name(/admin/product) but method is different so filtered
routes.get("/add-product", adminController.getAddProduct);
routes.get("/products", adminController.getProducts);
routes.post("/add-product", adminController.postAddProduct);


module.exports = routes;
