const products = [];

exports.getAddProduct = (req, res, next) => {
  //sending page title and path to inject in engine and also rendering add-product temp file
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

exports.postAddProduct = (req, res, next) => {
  products.push({ title: req.body.title });
  //reditect to home page
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  //send data(products) to inject in ejs template
  res.render("shop", {
    prods: products,
    pageTitle: "Shop",
    path: "/",
  });
};
