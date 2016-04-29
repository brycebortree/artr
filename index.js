var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var request = require('request');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var Twitter = require('twitter');
var Flickr = require("flickrapi");
var app = express();
var db = require('./models');

app.set('view engine', 'ejs');
app.use(ejsLayouts);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:false}));

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

var Flickr = require("flickrapi"),
  flickrOptions = {
    api_key: process.env.FLICKR_KEY,
    secret: process.env.FLICKR_SECRET
};

app.get("/", function(req, res) {
  res.render('home');
});

app.get("/choose", function(req, res) {
  if (req.currentUser) {
  res.render('choose');
  } else {
    res.send('you must log in to save your art!');
  }
});

app.get("/user", function(req, res) {
  if (req.currentUser) {
    db.art.findAll({where: {userId:req.currentUser.id}}).then(function(arts) {
      console.log(arts);
      res.render('user', {arts:arts});
    });
  } else {
    res.send('you must log in to save your art!');
  }
});

app.get("/gallery", function(req, res) {
  db.art.findAll().then(function(arts) {
    res.render('gallery', {arts:arts});
   });
});

Flickr.tokenOnly(flickrOptions, function(error, flickr) {
  app.get("/art", function(req, res) {
    var flicks = [];
    var twits = [];

    var q = req.query.q;

    flickr.photos.search({
      tags: q,
      content_type: 1,
      nojsoncallback: 1,
      page: 1,
      per_page: 15
    }, function(err, flickResults) {
      if(err) {
        res.send(err);
      };
      flicks = flicks.concat(flickResults.photos.photo);

      client.get('search/tweets', {
        q: q,
        result_type: 'popular',
        lang: 'en'
      }, function(error, tweets, response){
        if(error) {
          res.send(err);
        } else {
        twits = twits.concat(tweets.statuses);
        res.render("choose",  {flicks: flicks, twits: twits, q:q});
        }
      });
    });
  });
});

app.post("/art", function(req, res) {
  var newArt = {twitUser: req.body.twitUser, 
                query: req.body.query, 
                tweetStatement: req.body.tweetStatement,
                flickrURL:req.body.flickrURL,
                userId: req.session.userId
                  };
  db.art.create(newArt).then(function(art){
    res.send(art);
  });
});


app.listen(process.env.PORT || 3000, function(){
  console.log('you\'re like a really great listener, 3000');
});