'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      minLatitude: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      maxLatitude: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      minLongitude: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      maxLongitude: {
        allowNull: false,
        type: Sequelize.DOUBLE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Users');
  }
};
