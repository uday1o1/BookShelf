const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
let dbConnect;
const uri =
  "mongodb+srv://uday1o1:UguNnqf3xAgK7dKY@cluster0.k9zabyl.mongodb.net/shop?retryWrites=true&w=majority";

//export connect func that returns client object in callback
//sets up connection
const mongoConnect = (cb) => {
  MongoClient.connect(uri)
    .then((client) => {
      console.log("Connected");
      //has active connection for current database instance
      dbConnect = client.db();
      cb();
    })
    .catch((err) => {
      console.log(err);
    });
};
//returns object for connection access
const getDb = () => {
  if(dbConnect) {
    return dbConnect;
  } else {
    throw "No database found";
  }
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;