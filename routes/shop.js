const express = require("express");
const routes = express.Router();
const shopController = require("../controllers/shop");
const isLoggedIn = require("../middleware/isLoggedIn");
isLoggedIn, routes.get("/", shopController.getIndex);

routes.get("/products", shopController.getProducts);

// //product route with prodId part as a variable(don't put "products/xx" urls after this)
// //prod id will be the mongoDb object unique id
routes.get("/products/:prodId", shopController.getProduct);

routes.get("/cart", shopController.getCart);

// // //addToCart extracts prodId of product whose details page was opened
routes.post("/cart", isLoggedIn, shopController.addToCart);

routes.post(
  "/delete-cart-product",
  isLoggedIn,
  shopController.postDeleteProduct
);

routes.get("/orders", isLoggedIn, shopController.getOrders);

routes.post("/checkout", isLoggedIn, shopController.postOrder);

module.exports = routes;
