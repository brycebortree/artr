var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var request = require('request');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();
var db = require('./models');

app.set('view engine', 'ejs');
app.use(ejsLayouts);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({
  secret: 'behindtheuniverseflowers',
  resave: false,
  saveUninitialized: true
}));

app.get("/", function(req, res) {
  res.render('home');
});

app.get("/art", function(req, res) {
  var query = req.query.q;
  //console.log(query);
  var qs = {
    s: query
  }
  request({
    url: 'http://www.omdbapi.com/',
    qs: qs
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var data = JSON.parse(body);
        var results = data.Search;
        res.render("search/movies", {results: results});
      } else {
        res.render("error");
      }
  });
});

app.get("/movies/:imdbID", function(req, res) {
  var imdbID = req.params.imdbID;
  var qs = {
    i: imdbID
  }
  request({
    url: 'http://www.omdbapi.com/',
    qs: qs
  }, function(error, response, body) {
      var data = JSON.parse(body);
      console.log(data);
      res.render("search/show", {movie: data});
  })
});


var port = 3000;
app.listen(process.env.PORT || port);