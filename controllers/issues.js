var Issues = require('../models').Issues
var sequelize = require('sequelize');
var verify = require('../helpers/parameters');
var IssueNotFound = require('../exceptions/issueNotFound');
var InvalidParameter = require('../exceptions/invalidParameter');
var status = require('../helpers/status');

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
  },

  update: function(req, res, next) {
    if(req.body.status) {
      req.body.status.toUpperCase();

      if(!status.get(req.body.status)) {
        throw new InvalidParameter('Invalid status : ' + req.body.status);
      }
    }

    return Issues
      .findById(req.params.id)
      .then(issue => {
        if (!issue) {
          throw new IssueNotFound('Issue ' + req.params.id + ' not found');
        }
        return issue
          .update({
            status: req.body.status || issue.status,
            comment: req.body.comment || issue.comment
          })
          .then(() => res.status(204).send());
      })
  }
};
