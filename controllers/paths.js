var aws = require('../helpers/s3.js')
var Paths = require('../models').Paths
var PathNotFound = require('../exceptions/pathNotFound')


module.exports = {

  paths: function(req, res, next) {
      aws.saveToImageBucket('testfile.txt', 'hello world')
      res.send('test be created in s3');
  },

  city_activity: function(req, res, next) {
    city = req.params.city
    activity = req.params.activity

    // get sherbrooke file
    return Paths.find({
          attributes: ['file'],
          where: {
            $and: {
              city: city,
              activity: activity
            }
          },
        }).then(function (db_rep) {
          console.log(db_rep.file)
         aws.getFromRoadBucket(db_rep.file, function(s3reponse) {
           res.send(s3reponse)
         })
    }).catch(function (err) {
      //next(new PathNotFound('Path : ' + city + "/" + activity + " not found"))
      res.send("City not found")
    })


  },

  list_available: function(req, res, next) {
    type = req.params.type
    if(type == "city") {
      // return all available cities
      return Paths.findAll({
            attributes: ['city'], //object
            group: ['city'],
          }).then(function (list) {
            o = []
            for (i = 0; i < list.length; i++) {
                o.push(list[i].city)
            }
            res.status(200).json(o);
      })
    } else if (type == "activity") {
      return Paths.findAll({
            attributes: ['activity'], //object
            group: ['activity'],
          }).then(function (list) {
            o = []
            for (i = 0; i < list.length; i++) {
                o.push(list[i].activity)
            }
            res.status(200).json(o);
      })
    }else {
      res.send("Not found")
    }
  }
};
