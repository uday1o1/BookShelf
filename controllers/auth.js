const User = require("../models/user");
const bcrypt = require("bcrypt");
//setting salt round which tells bcrypt amount of time for pswd hashing
const saltRounds = 10;

exports.getLogin = (req, res, next) => {
  //flash msg is array of flashed strings, to send null if no flash so set value in variable if available
  let errMessage = req.flash("error");
  if (errMessage.length > 0) {
    //latest msg in start of array
    errMessage = errMessage[0];
  } else {
    //no error so no need to flash
    errMessage = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login Page",
    loggedIn: req.session.loggedIn,
    errMessage: errMessage,
  });
};

exports.postLogin = (req, res, next) => {
  const signInEmail = req.body.signInEmail;
  const signInPassword = req.body.signInPassword;

  //if user found then check if entered pswd same a unhashed user pswd
  User.findOne({ email: signInEmail })
    .then((user) => {
      if (!user) {
        req.flash("error", "Wrong email or password");
        console.log("user not found");
        return res.redirect("/login");
      }
      bcrypt.compare(signInPassword, user.password, function (err, result) {
        //if pswd match
        if (result) {
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
        }
        //if pswd not matched
        else {
          req.flash("error", "Pls enter the correct password");
          console.log("wrong pswd");
          return res.redirect("/login");
        }
        if (err) {
          throw err;
        }
      });
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
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
  const signUpName = req.body.signUpName;
  const signUpEmail = req.body.signUpEmail;
  const signUpPassword = req.body.signUpPassword;

  //if user already exists
  User.findOne({ email: signUpEmail })
    .then((user) => {
      if (user) {
        req.flash(
          "error",
          "This user already exists either login or please sign up with another email id"
        );
        console.log("user already exists, pls login");
        return res.redirect("/login");
      }
      //hash pswd using generated salt
      bcrypt.hash(signUpPassword, saltRounds, function (err, hash) {
        if (err) {
          console.log(err);
        }
        //pswd saved is the new hashed pswd
        const user = new User({
          name: signUpName,
          email: signUpEmail,
          password: hash,
          cart: { products: [], totalPrice: 0 },
        });
        user
          .save()
          .then(() => {
            console.log("new user created");
            req.session.loggedIn = false;
            res.redirect("/login");
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
