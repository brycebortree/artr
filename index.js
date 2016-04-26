var express = require('express');
var bodyParser = require('body-parser');
var ejsLayouts = require('express-ejs-layouts');
var session = require('express-session');
var request = require('request');
var flash = require('connect-flash');
var Twitter = require('twitter');
var ig = require('instagram-node').instagram();
var Flickr = require("flickrapi"),
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

ig.use({ access_token: process.env.INSTA_AUTH });
ig.use({ client_id: process.env.INSTA_CLIENT,
         client_secret: process.env.INSTA_SECRET });

    flickrOptions = {
      api_key: process.env.FLICKR_KEY,
      secret: process.env.FLICKR_SECRET
    };
 
Flickr.tokenOnly(flickrOptions, function(error, flickr) {
  app.get("/pics", function(req, res) {
  flickr.photos.search({
    tags: flickr.options.tags,
    content_type: flickr.options.1
    page: 1,
    per_page: 500
  }, function(err, result) {
    console.log(result);
    res.send(result);
    });
  });
});



app.get("/", function(req, res) {
  res.render('home');
});

app.get("/art", function(req, res) {
  res.render('showart');
});

app.get("/user", function(req, res) {
  if (req.currentUser) {
  res.render('user');
  } else {
    res.send('you must log in to create an account');
  }
});

app.get("/tweets", function(req, res){
  // var query = req.query.query;
  var query = "kitten";
  console.log(query);
  client.get('search/tweets', {q: 'query'}, function(error, tweets, response){
    console.log(tweets);
    console.log(req.body);
    res.send(tweets);
    //  if (!error && response.statusCode == 200) {
    //     var data = JSON.parse(req.body);
    //     var results = data.text;
    //     res.render("choose", {results: results});
    //   } else {
    //     res.render("error");
    //   }
  });
});

// app.get("/instas", function(req, res){
//   // var query = req.query.query;
//   var query = "kitten";
//   console.log(query);
//   client.get('search/tweets', {q: 'query'}, function(error, tweets, response){
//     console.log(tweets);
//     console.log(req.body);
//     res.send(tweets);
//     });
// });

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
app.listen(process.env.PORT || port, function(){
  console.log('you\'re like a really great listener');
});