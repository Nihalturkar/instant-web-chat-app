var express = require('express');
var router = express.Router();
var userModel = require("./users");
var passport = require("passport");

const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const storage = multer.diskStorage({
  destination : function(req,file,cb){
    cb(null, './public/images/uploads');
  },
  filename:function(req,file,cb){
   crypto.randomBytes(14,function(err,buff){
    const fn = buff.toString("hex")+path.extname(file.originalname);
    cb(null,fn)
   })
  }
});

const upload = multer({storage:storage})

const localStratagy = require("passport-local");
passport.use(new localStratagy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post("/register",function(req,res){
  var newUser  = new userModel({
    username:req.body.username,
    email : req.body.email,
  })
  userModel.register(newUser,req.body.password)
  .then(function(u){
    passport.authenticate("local")(req,res,function(){
      res.render("login",{u})
    })
  }).catch(function(e){
    res.send(e)
  })
});

router.get('/login',function(req,res){
  res.render('login')
});

router.post('/login', passport.authenticate("local",
{successRedirect:"/profile", 
failureRedirect:"/login"
}), function(req,res){ } ) ;


router.get("/profile",isLoggedIn,function(req,res){
  userModel.findOne({username:req.session.passport.user})
  .then(function(loggedinuser){
    res.render("profile",{loggedinuser})
  })
})


router.post('/upload', isLoggedIn, upload.single('image'), function (req, res, next) {
  
  userModel.findOne({username:req.session.passport.user})
  .then(function(loggedinuser){
    loggedinuser.profileImage = req.file.filename
    loggedinuser.save().then(function(){
      res.render("profile",{loggedinuser})
    })
  })
})

router.get("/logout",function(req,res,next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})


function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next()
  }
  else{
    res.redirect("/")
  }
};

module.exports = router;
