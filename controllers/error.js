exports.err404 = (req, res, next) => {
  // status code 404 for error page
  res.status(404).render("err404", { pageTitle: "Page Not Found", path: "/err404" });
};