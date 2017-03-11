var Users = require('../models').Users
var InvalidParameter = require('../exceptions/invalidParameter');

module.exports = {

  coordinates: function(username, callback) {
    return Users.find({
      where: {
          name: username
        }
      })
      .then(coordinates => {
        callback(null, coordinates);
      })
      .catch(function (err) {
        callback(new InvalidParameter('Invalid city : ' + username));
      })
  }
};
