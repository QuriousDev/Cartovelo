'use strict';
module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define('Users', {
    name: DataTypes.STRING,
    minLatitude: DataTypes.DOUBLE,
    maxLatitude: DataTypes.DOUBLE,
    minLongitude: DataTypes.DOUBLE,
    maxLongitude: DataTypes.DOUBLE
  }, {
    createdAt: false,
    updatedAt: false,

    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Users;
};
