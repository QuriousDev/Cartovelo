var aws = require('../helpers/s3.js')


module.exports = {

  paths: function(req, res, next) {
      aws.saveToImageBucket('testfile.txt', 'hello world')
      res.send('test be created in s3');
  },

  city_activity: function(req, res, next) {
    city = req.params.city
    activity = req.params.activity
    if(city == "sherbrooke" && activity == "bike") {

      aws.getFromRoadBucket("sherbrooke_pistes_cyclables.json", function(s3reponse) {
        res.send(s3reponse)
      })
    }
  }
};
