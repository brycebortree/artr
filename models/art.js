'use strict';
module.exports = function(sequelize, DataTypes) {
  var art = sequelize.define('art', {
    twitUser: DataTypes.STRING,
    query: DataTypes.STRING,
    tweetStatement: DataTypes.STRING,
    flickrURL: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return art;
};