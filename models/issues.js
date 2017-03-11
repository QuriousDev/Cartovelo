var sequelize = require('sequelize');
var status = require('../helpers/status')

module.exports = function(sequelize, DataTypes) {
  var Issues = sequelize.define('Issues', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE,
    image: DataTypes.STRING,
    date: DataTypes.DATE,
    comment: DataTypes.STRING,
    status: {
      type: DataTypes.STRING,
      defaultValue: status.OPENED.toString()
    },

  }, {
    createdAt: false,
    updatedAt: false,

    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Issues;
};
