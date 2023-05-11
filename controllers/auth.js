exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "login",
    pageTitle: "Login Page",
  });
};

exports.postLogin = (req, res, next) => {
  const signUpName = req.body.signUpName;
  const signUpEmail = req.body.signUpEmail;
  const signUpPassword = req.body.signUpPassword;
  const signInEmail = req.body.signInEmail;
  const signInPassword = req.body.signInPassword;

  res.redirect("/");
};
