'use strict';
module.exports = function(sequelize, DataTypes) {
  var Paths = sequelize.define('Paths', {
    city: DataTypes.STRING,
    activity: DataTypes.STRING,
    file: DataTypes.STRING
  }, {
    classMethods: {
      createdAt: false,
      updatedAt: false,
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Paths;
};
