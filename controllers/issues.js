var Issues = require('../models').Issues
var sequelize = require('sequelize');
var verify = require('../helpers/parameters');

module.exports = {

  issues_list: function(req, res, next) {
    return Issues
      .all()
      .then(issues => res.status(200).json({ issues: issues }))
  },

  create: function(req, res, next) {
    verify.verifyParameter(req.body.title, 'title');
    verify.verifyParameter(req.body.description, 'description');
    verify.verifyParameter(req.body.latitude, 'latitude');
    verify.verifyParameter(req.body.longitude, 'longitude');

    return Issues
      .create({
        title: req.body.title,
        description: req.body.description,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        image: '',
        date: sequelize.fn('NOW')
      })
      .then(issue => res.status(201).json({ id: issue.id }));
  },

  image_upload: function(req, res, next) {
      filename = req.files[0].key
      res.status(200).send("Image " + filename + " successfully to id " + req.params.id)
  }
};
