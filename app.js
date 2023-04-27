const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
//returns a new express app instance when the express() func is run, can be used to init server
const app = express();

//setting ejs as template engine
app.set("view engine", "ejs");
//specifying where to look for html template files
//first view from name of app config, second view from path of template files
app.set("views", "views");

//assigning a folder so that it can serve static files
//all req going inside already take the path public so inside put path after public for links
app.use(express.static(path.join(__dirname, "public")));

const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");

//use body parser to parse through incoming data stream, it also works based on a middleware func, put on top of order
app.use(bodyParser.urlencoded({ extended: false }));

//only routes with /admin section will go inside(filtering routes)
//to use importing route func
app.use("/admin", adminRoute.routes);
app.use(shopRoute);

//handle all others url reqs
app.use("/", (req, res, next) => {
  // res.status(404).sendFile(path.join(__dirname, "views", "err404.html"));
  res.status(404).render("err404", { pageTitle: "Page Not Found" });
});

//to create server on express app and start listening
app.listen(3000);
