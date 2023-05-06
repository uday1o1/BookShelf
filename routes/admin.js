const express = require("express");
const routes = express.Router();
const adminController = require("../controllers/admin");

routes.get("/add-product", adminController.getAddProduct);
routes.post("/add-product", adminController.postAddProduct);

// routes.get("/edit-product/:prodId", adminController.getEditProduct)
// routes.post("/edit-product", adminController.postEditProduct);

// routes.post("/delete-product", adminController.postDeleteProduct);

routes.get("/products", adminController.getProducts);



module.exports = routes;
