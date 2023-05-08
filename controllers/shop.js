const Product = require("../models/product");
const User = require("../models/user");

exports.getIndex = (req, res, next) => {
  //returns all products in admin catalog
  Product.fetchAllProducts()
    .then((products) => {
      //rendering ejs files at views/shop/index.ejs
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAllProducts()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.prodId;

  //findByPk find specific object using primary key
  Product.fetchProduct(prodId)
    .then((fetchedProduct) => {
      //in render sending singular product whose title, price, etc accessed
      res.render("shop/product-detail", {
        product: fetchedProduct,
        pageTitle: fetchedProduct.title,
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cartProducts) => {
      res.render("shop/cart", {
        pageTitle: "My Shopping Cart",
        path: "/cart",
        //array of received cartProds
        products: cartProducts,
        //directly use from userCartData
        totalPrice: req.user.cart.totalPrice,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.addToCart = (req, res, next) => {
  //hidden input in addToCart form sends value of prodId
  const cartProd_id = req.body.cartProd_id;
  //addToCart func only executed when product fetched using prodId, this is needed as we need,
  Product.fetchProduct(cartProd_id).then((product) => {
    req.user
      .addProdToCart(product)
      .then((result) => {
        console.log("product added to cart");
        res.redirect("/cart");
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.postDeleteProduct = (req, res, next) => {
  const cartProd_id = req.body.cartProd_id;
  //to delete, fetch the prod to be deleted(as it's price info is needed to update totalPrice) then,
  //deleted it from cart
  Product.fetchProduct(cartProd_id).then((product) => {
    req.user
      .deleteProdFromCart(product)
      .then((result) => {
        console.log("product deleted from cart");
        res.redirect("/cart");
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then((orders) => {
      console.log(orders)
      res.render("shop/orders", {
        pageTitle: "My Orders",
        path: "/orders",
        orders: orders,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postOrder = (req, res, next) => {
  //createOrder from user
  req.user
    .createOrder()
    .then((result) => {
      console.log("order placed");
      res.redirect("/orders");
    })
    .catch((err) => {
      console.log(err);
    });
};
