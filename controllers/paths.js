var issues = require('../models/paths')
var AWS = require('aws-sdk');
var s3 = new AWS.S3();
// Les noms de compartiments doivent être uniques pour tous les utilisateurs S3
var myBucket = 'test-03de30f2-15e8-4929-98d5-9cf8275313fc';
var myKey = 'HelloWorld.txt';

module.exports = {

  paths: function(req, res, next) {
      // create file in bucket and make it public-read
      s3.createBucket({Bucket: myBucket}, function(err, data) {
      if (err) {
         console.log(err);
         } else {
           params = {Bucket: myBucket, Key: myKey, Body: 'Hello 2!', ACL: 'public-read'};
           s3.putObject(params, function(err, data) {
               if (err) {
                   console.log(err)
               } else {
                   console.log("Successfully uploaded data to myBucket/myKey");
               }
            });
         }
      });

      res.send('File ' + myBucket + ' ' + myKey + ' should be created in s3');
  }
};
