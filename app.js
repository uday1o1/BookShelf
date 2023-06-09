const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
require('dotenv').config()

//helper func for initializing db connect in separate file
const dbConnect = require("./util/database").dbConnect;
const dbStore = require("./util/database").dbStore;

//returns mongoClient in cb
const User = require("./models/user");

//returns a new express app instance when the express() func is run, can be used to init server
const app = express();

//use mongoDbStore session to connect with db and store sessions
const store = dbStore();

//setting ejs as template engine
app.set("view engine", "ejs");
//specifying where to look for html template files
//first view from name of app config, second view from path of template files
app.set("views", "views");

//assigning a folder so that it can serve static files
//all req going inside already take the path public so inside put path after public for links
app.use(express.static(path.join(__dirname, "public")));

//initialize session object(do session config)(can access session info from req)
//also initialize where to store session data
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

//each req has flash now(use to send temporary info across requests in a session)
app.use(flash());

app.use((req, res, next) => {
  //if not logged in then no user to send with requests
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      //if logIn done then add user to requests so mongoose helper functionc can be used again
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
const authRoute = require("./routes/auth");
const error = require("./controllers/error");

//use body parser to parse through incoming data stream, put on top of order
app.use(bodyParser.urlencoded({ extended: false }));

//only routes with /admin section will go inside(filtering routes)
app.use("/admin", adminRoute);
app.use(shopRoute);
app.use(authRoute);

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
