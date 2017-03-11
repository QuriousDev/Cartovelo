var config = require('../config/s3.json');

var uuid = require('node-uuid');
var mime = require('mime-types');
var multer  = require('multer')
var multerS3 = require('multer-s3')

// aws init code
var AWS = require('aws-sdk');
AWS.config.update({
    signatureVersion: 'v4'
});
var s3 = new AWS.S3();

module.exports = {

  // create file in bucket and make it public-read
  saveToImageBucket: function(filename, body) {
    params = {Bucket: config.imageBucket, Key: filename, Body: body, ACL: 'public-read'};
    s3.putObject(params, function(err, data) {
       if (err) {
           console.log(err)
       } else {
           console.log("Successfully uploaded " + filename + "data to " + imageBucket);
       }
    });
  },

  getImageURL: function(name) {
    return name ? `${config.endpoint}/${config.imageBucket}/${name}` : name;
  },

  getFromRoadBucket: function(filename, callback) {
    var params = {Bucket: config.roadBucket, Key: filename};
    s3.getObject(params, function(err, json_data) {
      if (!err) {
        var json = JSON.parse(new Buffer(json_data.Body).toString("utf8"));
        callback(json)
      } else {
        callback("There was an error : " + err)
      }
    });
  },

  getUploadMulterS3: function() {
    return multer({
        storage: multerS3({
            s3: s3,
            bucket: config.imageBucket,
            acl: 'public-read',
            key: function (req, file, cb) {
                ext = mime.extension(file.mimetype)
                name = uuid.v4() + "." + ext
                console.log(name);
                cb(null, name); //use Date.now() for unique file keys || file.originalname
            }
        })
    });
  }
}
