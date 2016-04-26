'use strict';
module.exports = function(sequelize, DataTypes) {
  var art = sequelize.define('art', {
    twitUser: DataTypes.STRING,
    query: DataTypes.STRING,
    tweetContent: DataTypes.STRING,
    tweetId: DataTypes.INTEGER,
    flickrTitle: DataTypes.STRING,
    farmId: DataTypes.INTEGER,
    serverId: DataTypes.INTEGER,
    flickrId: DataTypes.INTEGER,
    secretId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return art;
};