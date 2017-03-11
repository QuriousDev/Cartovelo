var Issues = require('../models').Issues
var sequelize = require('sequelize');
var verify = require('../helpers/parameters');
var IssueNotFound = require('../exceptions/issueNotFound');
var InvalidParameter = require('../exceptions/invalidParameter');
var status = require('../helpers/status');
var s3 = require('../helpers/s3.js');

module.exports = {

  issues_list: function(req, res, next) {
    return Issues
      .all()
      .then(issues => {
        issues.forEach(function(issue) {
          issue.image = s3.getImageURL(issue.image);
        });
        res.status(200).json({ issues: issues });
      })
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

      return Issues
        .findById(req.params.id)
        .then(issue => {
          return issue
            .update({
              image: filename || issue.image
            })
            .then(() => res.status(204).send());
        })
        .catch(function (err) {
          next(new IssueNotFound('Issue ' + req.params.id + ' not found'));
        });
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
        return issue
          .update({
            status: req.body.status || issue.status,
            comment: req.body.comment || issue.comment
          })
          .then(() => res.status(204).send());
      })
      .catch(function (err) {
        next(new IssueNotFound('Issue ' + req.params.id + ' not found'));
      });
  }
};
