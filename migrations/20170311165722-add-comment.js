'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
        'Issues',
        'comment',
        {
          type: Sequelize.STRING,
          allowNull: false
        }
      )
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Issues', 'comment')
  }
};
