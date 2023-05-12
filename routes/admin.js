const express = require("express");
const routes = express.Router();
const adminController = require("../controllers/admin");
const isLoggedIn = require("../middleware/isLoggedIn");

//reqs funmelled through
routes.get("/add-product", isLoggedIn, adminController.getAddProduct);
routes.post("/add-product", isLoggedIn, adminController.postAddProduct);

routes.get("/edit-product/:prodId", isLoggedIn, adminController.getEditProduct);
routes.post("/edit-product", isLoggedIn, adminController.postEditProduct);

routes.post("/delete-product", isLoggedIn, adminController.postDeleteProduct);

routes.get("/products", isLoggedIn, adminController.getProducts);

module.exports = routes;
