'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('arts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      twitUser: {
        type: Sequelize.STRING
      },
      query: {
        type: Sequelize.STRING
      },
      tweetContent: {
        type: Sequelize.STRING
      },
      tweetId: {
        type: Sequelize.INTEGER
      },
      flickrTitle: {
        type: Sequelize.STRING
      },
      farmId: {
        type: Sequelize.INTEGER
      },
      serverId: {
        type: Sequelize.INTEGER
      },
      flickrId: {
        type: Sequelize.INTEGER
      },
      secretId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('arts');
  }
};