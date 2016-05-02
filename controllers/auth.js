var express = require('express');
var flash = require('connect-flash');
var db = require('../models');
var router = express.Router();

router.use(flash());

router.get('/signup', function(req, res) {
  res.render('auth/signup', {alerts:req.flash()});
});

router.post('/signup', function(req, res) {
  db.user.findOrCreate({
    where: {email: req.body.email},
    defaults: {username: req.body.username, password: req.body.password}
  }).spread(function(user, created) {
    res.redirect('/auth/login', {alerts:req.flash()});
  }).catch(function(err) {
    req.flash('danger', 'That username is already in use!');
    req.redirect('auth/signup');
  });
});

router.get('/login', function(req, res) {
  res.render('auth/login', {alerts:req.flash()});
});

router.post('/login', function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  db.user.authenticate(email, password, function(err, user) {
    if (err) {
      res.send(err);
    } else if (user) {
      req.session.userId = user.id;
      res.redirect('/');
    } else {
      req.flash('danger', 'Your email and/or password invalid');
      res.redirect('/login');
    }
  });
});

router.get('/logout', function(req, res) {
  req.session.userId = false;
  req.flash('success', 'You\'ve successfully logged out!')
  res.redirect('/');
});

module.exports = router;
