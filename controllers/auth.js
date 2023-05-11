exports.getLogin = (req, res, next) => {
  console.log(req.session.loggedIn)
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login Page",
    loggedIn: req.session.loggedIn
  });
};

exports.postLogin = (req, res, next) => {
  const signUpName = req.body.signUpName;
  const signUpEmail = req.body.signUpEmail;
  const signUpPassword = req.body.signUpPassword;
  const signInEmail = req.body.signInEmail;
  const signInPassword = req.body.signInPassword;
  //when logInPost req sent then session logIn key : true
  req.session.loggedIn = true;

  res.redirect("/");
};
