const express = require("express");
const router = express.Router();

module.exports = (req, res, next) => {
  const csrfToken = req.body.csrfToken; // Assuming the CSRF token is sent in the request body

  // Compare the CSRF token from the request with the one stored in the cookie
  if (csrfToken === req.cookies.csrfToken) {
    // CSRF token is valid, process the form submission
    // ...
    return next();
  } else {
    // CSRF token is invalid or missing
    res.status(403).send("Invalid CSRF token");
    next();
  }

  next();
};
