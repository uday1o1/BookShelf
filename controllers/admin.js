const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.fetchAllProducts()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
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
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const prod = new Product(title, imageUrl, price, description);
  prod
    .saveProduct()
    .then((result) => {
      //result only gotten when product object created and saved to db collection
      console.log("added new product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

// exports.getEditProduct = (req, res, next) => {
//   //fetching the productId of item to be eddited from url parameters
//   const prodId = req.params.prodId;
//   //fetching query from url, which will be true if in editMode
//   //query will be accessed from part of url after '?' as key:value pairs, where each query is separated by '&'
//   const editMode = req.query.editMode;

//   //editMode also sent so that form can have prevous product data preloaded for editing,
//   //else new product so empty form
//   //need to fetch product as it's attributes accessed to populate ejs form
//   Product.findByPk(prodId)
//     .then((fetchedProduct) => {
//       res.render("admin/editProduct", {
//         pageTitle: "Edit Product",
//         editMode: editMode,
//         product: fetchedProduct,
//         //sending empty path as it was being accessed in ejs file includes
//         path: "",
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// exports.postEditProduct = (req, res, next) => {
//   const prodId = req.body.prodId;
//   const title = req.body.title;
//   const imageUrl = req.body.imageUrl;
//   const price = req.body.price;
//   const description = req.body.description;

//   Product.update(
//     {
//       title: title,
//       imageUrl: imageUrl,
//       price: price,
//       description: description,
//     },
//     { where: { prodId: prodId } }
//   )
//     .then((result) => {
//       console.log(result);
//       res.redirect("/");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// exports.postDeleteProduct = (req, res, next) => {
//   const prodId = req.body.prodId;

//   //destroys the product record then, redirects if successful
//   Product.destroy({
//     where: {
//       prodId: prodId,
//     },
//   })
//     .then(() => {
//       res.redirect("/admin/products");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };
