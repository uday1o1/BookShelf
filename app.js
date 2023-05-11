const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const mongoose = require("mongoose");
const dbConnect = require("./util/database").dbConnect;
//returns mongoClient in cb
const User = require("./models/user");

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

// testUser login(no routes, every request goes through a "user")
app.use((req, res, next) => {
  User.findById("645a027e3b8a718194017040")
    .then((user) => {
      //add complete mongoose user instance to each user request(needed to access all user functions)
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

//routes and controllers imported
const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");
const error = require("./controllers/error");

//use body parser to parse through incoming data stream, put on top of order
app.use(bodyParser.urlencoded({ extended: false }));

//only routes with /admin section will go inside(filtering routes)
app.use("/admin", adminRoute);
app.use(shopRoute);

//handle all others url reqs
app.use("/", error.err404);

// start listening when client retreived from db
dbConnect()
  .then((result) => {
    //create new user if not found in user collection
    User.findOne().then((user) => {
      //if no user found
      if (!user) {
        const user = new User({
          name: "uday",
          email: "uday@gmail.com",
          cart: {
            products: [],
            totalPrice: 0,
          },
        });
        user.save();
      }

      console.log("connected");
      app.listen(3000);
    });
  })
  .catch((err) => {
    console.log(err);
  });
