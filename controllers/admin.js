const Product = require("../models/product");

//using populate() or select() we can choose which fields to populate and which to leave at given path
exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        loggedIn: req.session.loggedIn
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAddProduct = (req, res, next) => {
  //sending page title and path to inject in engine and also rendering add-product temp file
  res.render("admin/editProduct", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    //send null as true will populate form with product values
    editMode: null,
    loggedIn: req.session.loggedIn
  });
};

exports.postAddProduct = (req, res, next) => {
  //create new moongose product instance
  const product = new Product({
    title: req.body.title,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    description: req.body.description,
    //whole user instance attatched mongoose picks object_id directly from it
    user_id: req.user,
  });

  //mongoose model object save method
  product
    .save()
    .then((result) => {
      //result only gotten when product object created and saved to db collection
      console.log("added new product to catalog");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  //fetching the productId of item to be eddited from url parameters
  const _id = req.params.prodId;
  //fetching query from url, which will be true if in editMode
  const editMode = req.query.editMode;

  //editMode also sent so that form can have prevous product data preloaded for editing,
  //else new product so empty form
  //need to fetch product as it's attributes accessed to populate ejs form
  Product.findById(_id)
    .then((fetchedProduct) => {
      res.render("admin/editProduct", {
        pageTitle: "Edit Product",
        editMode: editMode,
        product: fetchedProduct,
        //sending empty path as it was being accessed in ejs file
        path: "",
        loggedIn: req.session.loggedIn
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const _id = req.body._id;

  //find mongoose product then, if save on existing product then, it updates
  Product.findById(_id)
    .then((product) => {
      product.title = req.body.title;
      product.imageUrl = req.body.imageUrl;
      product.price = req.body.price;
      product.description = req.body.description;
      return product.save();
    })
    .then((result) => {
      console.log("updated product in catalog");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const _id = req.body._id;
  //before deleting whole product need to delete it from cart first,
  //to delete, fetch the prod to be deleted(as it's price info is needed to update totalPrice) then,
  //deleted it from cart
  Product.findById(_id).then((product) => {
    const cartProductIndex = req.user.cart.products.findIndex((prod) => {
      return prod._id.toString() === product._id.toString();
    });
    //if cartIndex = -1, so prod not in cart so only delete from catalog,
    //no need to call deleteCartFunc
    if (cartProductIndex === -1) {
    //deleted product from catalog,
    //using mongoose find and remove func
    Product.findByIdAndRemove(_id)
      .then(() => {
        console.log("deleted product from catalog");
        res.redirect("/admin/products");
      })
      .catch((err) => {
        console.log(err);
      });
    } else {
      req.user
        .deleteProdFromCart(product)
        .then(() => {
          console.log("product deleted from cart");
        })
        .then(() => {
          //deleted product from catalog
          Product.findByIdAndRemove(_id);
        })
        .then(() => {
          console.log("deleted product from catalog");
          res.redirect("/admin/products");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
};
