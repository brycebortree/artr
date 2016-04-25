var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var request = require('request');
var bodyParser = require('body-parser');
var session = require('express-session');
var db = require('./models');
var app = express();

app.set('view engine', 'ejs');
app.use(ejsLayouts);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({
  secret: 'flowersbehinduniverse',
  resave: false,
  saveUninitialized: true
}));

app.get("/", function(req, res) {
  res.render('home');
});

app.get("/art", function(req, res) {
  res.render('show');
});

app.get("/signup", function(req, res) {
  res.render('signup');
});

app.get("/user", function(req, res) {
  res.render('user');
});

app.post('/signup', function(req, res) {
  console.log(req.body);
  db.user.findOrCreate({
    where: {
      email: req.body.email
  }, 
  defaults: {
    username: req.body.username,
    password: req.body.password
    }
  }).spread(function(user, created){
    if(created) {
        res.redirect('/user');
    } else {
        req.flash('danger', 'username already taken. Please choose another username.');
        res.redirect('signup');
    }
  }).catch(function(err){
    res.send(err);
  });
});

app.get("/auth/login", function(req, res) {
  res.render('login');
});

app.post('/auth/login', function(req, res) {
  console.log(req.body);
  db.user.findOrCreate({
    where: {
      username: req.body.username
  }, 
  defaults: {
    email: req.body.email,
    password: req.body.password
    }
  }).spread(function(user, created){
    if(created) {
        res.redirect('/user');
    } else {
        req.flash('danger', 'username already taken. Please choose another username.');
        res.redirect('/auth/login');
    }
  }).catch(function(err){
    res.send(err);
  });
});

app.get("/art", function(req, res) {
  var query = req.query.q;
  console.log(query);
  var qs = {
    s: query
  }
  request({
    url: 'https://api.twitter.com/1.1/search/tweets.json',
    qs: qs
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var data = JSON.parse(body);
        var results = data.Search;
        res.render("show", {results: results});
      } else {
        res.render("error");
      }
  });
});

var port = 3000;
app.listen(process.env.PORT || port);