const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
//use to create environment variable which has dbConnectString
require('dotenv').config()

exports.dbConnect = () => {
  // return mongoose.connect(URI);
  return mongoose.connect(process.env.DB_URI);
};

exports.dbStore = () => {
  return new MongoDBStore({
    uri: process.env.DB_URI,
    collection: "mySessions",
  });
};
