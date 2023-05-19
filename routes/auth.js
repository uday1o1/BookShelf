const express = require("express");
const routes = express.Router();
const authController = require("../controllers/auth");

routes.get("/login", authController.getLogin);
routes.post("/login", authController.postLogin);

routes.post("/logout", authController.postLogout);

routes.post("/signup", authController.postSignIn);

routes.get("/reset-pass", authController.getResetPass);
routes.post("/reset-pass", authController.postResetPass);

module.exports = routes;
