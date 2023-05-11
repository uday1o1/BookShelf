const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  console.log(req.session.loggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login Page",
    loggedIn: req.session.loggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  // console.log(req.body.signInEmail, req.body.signInPassword)
  // User.find({email: req.body.signInEmail, password: req.body.signInPassword})
  User.findById("645a027e3b8a718194017040")
    .then((user) => {
      console.log(user)
      //when logInPost req sent then session logIn key : true
      req.session.loggedIn = true;
      //add complete mongoose user instance to each user request(needed to access all user functions)
      //add user to current session requests
      req.session.user = user;
      //redirect after session saved
      //no need to use save always just when .then(func) needed
      req.session.save((err) => {
        if (err) {
          console.log(err);
        }
        console.log("logged in");
        res.redirect("/");
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  //destroy(delete) session when logged out
  //session cookie also deleted in db(may be still stored locally but no issue as session_id will never match in db)
  req.session.destroy((err) => {
    console.log("logged out");
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
};

exports.postSignIn = (req, res, next) => {
  const user = new User({
    name: req.body.signUpName,
    email: req.body.signUpEmail,
    password: req.body.signUpPassword,
    cart: { products: [], totalPrice: 0 },
  });
  user
    .save()
    .then(() => {
      console.log("new user created")
      res.redirect("/login");
      req.session.loggedIn = false;
    })
    .catch((err) => {
      console.log(err);
    });
};
