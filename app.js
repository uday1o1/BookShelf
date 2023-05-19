const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

require("dotenv").config();
// const cookieParser = require("cookie-parser");
// const csrf = require("tiny-csrf");

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

//use body parser to parse through incoming data stream, put on top of order
app.use(bodyParser.urlencoded({ extended: false }));

// app.use(cookieParser(process.env.COOKIE_PARSER_SECRET));

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

//after session created(as csrf uses sessions)
//sending csrfProttection middle ware with each post req
// app.use(csrf(process.env.CSRF_SECRET));
// app.use((req, res, next) => {
//   res.locals.csrfToken = req.csrfToken();
//   next();
// });

//each req has flash now(use to send temporary info across requests in a session)
app.use(flash());

app.use((req, res, next) => {
  //if not logged in then no user to send with requests
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      //if logIn done then add user to requests so mongoose helper functions can be used again
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

//use for adding values needed for all renders
//put after session creation and login
//define a local response variable
app.use((req, res, next) => {
  res.locals.loggedIn = req.session.loggedIn;
  next();
});

//routes and controllers imported
const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");
const authRoute = require("./routes/auth");
const error = require("./controllers/error");

//only routes with /admin section will go inside(filtering routes)
app.use("/admin", adminRoute);
app.use(shopRoute);
app.use(authRoute);

//handle all others url reqs
app.use("/", error.err404);

// start listening when client retreived from db
dbConnect()
  .then((result) => {
    console.log("connected");
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => {
    console.log(err);
  });
