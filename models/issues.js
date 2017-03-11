'use strict';
module.exports = function(sequelize, DataTypes) {
  var Issues = sequelize.define('Issues', {
    id: DataTypes.INTEGER
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE,
    image: DataTypes.STRING,
    date: DataTypes.DATE,
    createdAt: false,
    updatedAt: false
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Issues;
};
