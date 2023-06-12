var mongoose = require("mongoose");

mongoose.set("strictQuery",false);

var plm = require("passport-local-mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/chatdatabase");

var userSchma = mongoose.Schema({

  username: String,
  email: String,
  password:String,
  profileImage:String
})
userSchma.plugin(plm);

module.exports = mongoose.model("user",userSchma);