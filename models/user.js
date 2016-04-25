'use strict';

var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      validate: {
        len: [8, 99]
      }
  }
}, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      },
        authenticate: function(email, password, callback) {
        this.find({
          where: {email: email}
        }).then(function(user) {
          if (!user) callback(null, false);
          bcrypt.compare(password, user.password, function(err, result) {
            if (err) return callback(err);
            callback(null, result ? user : false);
          });
        }).catch(callback);
      }
    },
    hooks: {
      beforeCreate: function(user, options, callback) {
        if (user.password) {
          bcrypt.hash(user.password, 10, function(err, hash) {
            if (err) return callback(err);
            user.password = hash;
            callback(null, user);
          });
        } else {
          callback(null,user);
        }
      }
    },
  });
  return user;
};