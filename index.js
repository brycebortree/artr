var express = require('express');
var bodyParser = require('body-parser');
var ejsLayouts = require('express-ejs-layouts');
var session = require('express-session');
var request = require('request');
var flash = require('connect-flash');
var Twitter = require('twitter');
// var ig = require('instagram-node').instagram();
var Flickr = require("flickrapi");
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

// ig.use({ access_token: process.env.INSTA_AUTH });
// ig.use({ client_id: process.env.INSTA_CLIENT,
//          client_secret: process.env.INSTA_SECRET });

var Flickr = require("flickrapi"),
    flickrOptions = {
      api_key: process.env.FLICKR_KEY,
      secret: process.env.FLICKR_SECRET
    };

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
  // var query = req.body.query;
  var query = "kitten";
  console.log(query);
  client.get('search/tweets', {
    q: query,
    result_type: 'mixed',
    lang: 'en'
  }, function(error, tweets, response){
    console.log(tweets.statuses);
    console.log(req.body);
    res.send(tweets.statuses);
  });
});

Flickr.tokenOnly(flickrOptions, function(error, flickr) {
  app.get("/pics", function(req, res) {
    var query = "kitten";

    flickr.photos.search({
      tags: query,
      content_type: 1,
      nojsoncallback: 1,
      page: 1,
      per_page: 15
    }, function(err, result) {
      if(err) {throw err};
      console.log(result);
      res.send(result.photos[0]);
    });
  });
});


var port = 3000;
app.listen(process.env.PORT || port, function(){
  console.log('you\'re like a really great listener, 3000');
});