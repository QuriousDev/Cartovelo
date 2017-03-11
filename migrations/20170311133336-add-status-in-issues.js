var status = require('../helpers/status')

'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
        'Issues',
        'status',
        {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: status.OPENED.toString()
        }
      )
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Issues', 'status')
  }
};
