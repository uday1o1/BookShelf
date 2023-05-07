const Product = require("../models/product");
const Cart = require("../models/cart");
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
  //need to fetch all cart products then, find all products(general product model) which are in cart
  Cart.fetchCart((cart) => {
    const cartProducts = [];
    let cartProduct = { cartProdData: {}, qty: 0 };

    //fetching all products then pushing the products whose,
    //prodId is also in cartProducts
    Product.findAll()
      .then((products) => {
        for (prod of products) {
          //checking each general product with all all cart products
          const prodFoundInCart = cart.products.find(
            (product) => product.prodId === prod.prodId
          );
          //if product found in cart
          if (prodFoundInCart) {
            cartProduct.cartProdData = prod;
            cartProduct.qty = prodFoundInCart.qty;
            cartProducts.push(cartProduct);
          }
        }

        res.render("shop/cart", {
          pageTitle: "My Shopping Cart",
          path: "/cart",
          products: cartProducts,
          totalPrice: cart.totalPrice,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.addToCart = (req, res, next) => {
  //hidden input in addToCart form sends value of prodId
  const cartProd_id = req.body.cartProd_id;
  //addToCart func only executed when product fetched using prodId, this is needed as we need,
  Product.fetchProduct(cartProd_id)
  .then((product) => {
    req.user
    .addProdToCart(product)
    .then((result) => {
      console.log("product added to cart");
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
  })
  
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "My Orders",
    path: "/orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.prodId;

  //fetch product using prodId and find Product whose id, price will be used to,
  //delete product from cart and update the totalPrice
  Product.findByPk(prodId)
    .then((fetchedProduct) => {
      Cart.deleteCartProduct(prodId, fetchedProduct.price);
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};
