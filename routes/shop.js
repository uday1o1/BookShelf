const express = require("express");
const routes = express.Router();
const shopController = require("../controllers/shop");

routes.get("/", shopController.getIndex);

routes.get("/products", shopController.getProducts);

// //product route with prodId part as a variable(don't put "products/xx" urls after this)
// //prod id will be the mongoDb object unique id
routes.get("/products/:prodId", shopController.getProduct);

routes.get("/cart", shopController.getCart);

// //addToCart extracts prodId of product whose details page was opened
routes.post("/cart", shopController.addToCart);

routes.post("/delete-cart-product", shopController.postDeleteProduct);

routes.get("/orders", shopController.getOrders);

routes.post("/checkout", shopController.postOrder);

module.exports = routes;
