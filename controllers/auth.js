const User = require("../models/user");
const bcrypt = require("bcrypt");
require("dotenv").config();
//setting salt round which tells bcrypt amount of time for pswd hashing
const saltRounds = 10;
const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");

//init nodemailer with sendgrid account through api key
const options = {
  auth: {
    api_key: process.env.SENDGRID_API_KEY,
  },
};

const mailer = nodemailer.createTransport(sgTransport(options));

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
          req.flash("error", "Please enter the correct password");
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

            //need to send mail to new user for successful signUp
            //need to set up authorized sender in sendGrid first
            const email = {
              to: signUpEmail,
              from: "uday1o1arora@gmail.com",
              subject: "Thanks for signing up at the bookShelf",
              text: "Happy Reading !!!",
              html: "<b>Happy Reading !!!</b>",
            };
            mailer.sendMail(email, function (err, result) {
              if (err) {
                console.log(err);
              }
              console.log(result);
            });
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

exports.getResetPass = (req, res, next) => {
  let errMessage = req.flash("error");
  if (errMessage.length > 0) {
    //latest msg in start of array
    errMessage = errMessage[0];
  } else {
    //no error so no need to flash
    errMessage = null;
  }

  res.render("auth/reset", {
    path: "/reset-pass",
    pageTitle: "Reset User Password Page",
    errMessage: errMessage,
  });
};

exports.postResetPass = (req, res, next) => {
  const resetEmail = req.body.resetEmail;

  //use crypto to make 32 bit token(generated as hex convert to string)
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset-pass");
    }

    const token = buffer.toString("hex");

    User.findOne({ email: resetEmail })
      .then((user) => {
        if (!user) {
          req.flash(
            "error",
            "This user does not exist please type the correct email id"
          );
          console.log("email not in db for pass reset");
          return res.redirect("/reset-pass");
        }

        //add token to user db with token expiry of 1hr from token generation
        user.resetToken = token;
        user.resetTokenExpiry = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        req.flash(
          "error",
          "The password reset link has been sent to your mail"
        );
        console.log("user exists, mail sent");
        res.redirect("/login");

        //after token generated and saved in user db then send mail with token
        const email = {
          to: resetEmail,
          from: "uday1o1arora@gmail.com",
          subject: "Reset User Password",
          html: `
        <p>Click the below link to reset your password</p>
        <a href="http://localhost:3000/login/new-pass/${token}">Reset Password</a>
        `,
        };
        mailer.sendMail(email, function (err, result) {
          if (err) {
            console.log(err);
          }
          console.log(result);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
