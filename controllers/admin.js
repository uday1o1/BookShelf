const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.fetchProducts((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};

exports.getAddProduct = (req, res, next) => {
  //sending page title and path to inject in engine and also rendering add-product temp file
  res.render("admin/editProduct", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    //send null as true will populate form with product values
    editMode: null,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const prod = new Product(null, title, imageUrl, price, description);
  prod.save();
  //reditect to home page
  res.redirect("/");
};

exports.getEditProduct = (req, res, next) => {
  //fetching the productId of item to be eddited from url parameters
  const prodId = req.params.prodId;
  //fetching query from url, which will be true if in editMode
  //query will be accessed from part of url after '?' as key:value pairs, where each query is separated by '&'
  const editMode = req.query.editMode;

  //editMode also sent so that form can have prevous product data preloaded for editing,
  //else new product so empty form
  //need to fetch product as it's attributes accessed to populate ejs form
  Product.fetchProduct(prodId, (fetchedProduct) => {
    res.render("admin/editProduct", {
      pageTitle: "Edit Product",
      editMode: editMode,
      product: fetchedProduct,
      //sending empty path as it was being accessed in ejs file includes
      path: "",
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.prodId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  //this product instance has prodId already so, func will update and not create new product object
  const newProd = new Product(prodId, title, imageUrl, price, description);
  newProd.save();

  res.redirect("/");
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.prodId;
  Product.fetchProduct(prodId, (fetchedProduct) => {
    Product.delete(prodId, fetchedProduct.price);
    res.redirect("/admin/products");
  });
};
