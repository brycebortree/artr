var express = require('express');
var bodyParser = require('body-parser');
var ejsLayouts = require('express-ejs-layouts');
var session = require('express-session');
var request = require('request');
var flash = require('connect-flash');
var Twitter = require('twitter');
var db = require('./models');
var app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:false}));
app.use(ejsLayouts);
app.use(express.static(__dirname + '/public'));

app.use(session({
  secret: 'flowersbehinduniverse',
  resave: false,
  saveUninitialized: true
}));

app.use(function(req, res, next) {
  if (req.session.userId) {
    db.user.findById(req.session.userId).then(function(user) {
      req.currentUser = user;
      res.locals.currentUser = user;
      next();
    });
  } else {
    req.currentUser = false;
    res.locals.currentUser = false;
    next();
  }
});

var authCtrl = require("./controllers/auth")
app.use("/auth", authCtrl);

var client = new Twitter({
  consumer_key: process.env.TWIT_CONSUMER_KEY,
  consumer_secret: process.env.TWIT_CONSUMER_SECRET,
  access_token_key: process.env.TWIT_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWIT_ACCESS_TOKEN_SECRET
});

app.get("/", function(req, res) {
  // console.log(req.session);
  req.session.whatever="hello!!!";
  res.render('home');
});

app.get("/art", function(req, res) {
  res.render('showart');
});

app.get("/user", function(req, res) {
  if (req.currentUser) {
  res.render('user');
  } else {
    res.send('sorry, you must be logged in to have an account');
  }
});

app.get("/logout", function(req, res) {
  res.redirect('/');
});

app.get("/tweets", function(req, res){
  // var query = req.query.query;
  var query = "kitten";
  console.log(query);
  client.get('search/tweets', {q: 'query'}, function(error, tweets, response){
    console.log(tweets);
    res.send(tweets);
     if (!error && response.statusCode == 200) {
        var data = JSON.parse(body);
        var results = data.Search;
        res.render("choose", {results: results});
      } else {
        res.render("error");
      }
  });
});

// app.get("/art", function(req, res) {
//   var query = req.query.q;
//   console.log(query);
//   var qs = {
//     s: query
//   }
//   request({
//     url: 'https://api.twitter.com/1.1/search/tweets.json',
//     qs: qs
//     }, function (error, response, body) {
//       if (!error && response.statusCode == 200) {
//         var data = JSON.parse(body);
//         var results = data.Search;
//         res.render("show", {results: results});
//       } else {
//         res.render("error");
//       }
//   });
// });

var port = 3000;
app.listen(process.env.PORT || port);