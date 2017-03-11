var controller = require('../controllers/issues');
var express = require('express');
var router = express.Router();
// multer-s3 img
var aws = require('../helpers/s3.js')
var upload = aws.getUploadMulterS3()

// Issue metadata
router.get('/issues', controller.issues_list);
router.get('/issues/:city', controller.issues_list_city);
router.post('/issues/submit', controller.create);
router.put('/issues/:id', controller.update);

// Issue image
router.post('/issues/:id/image', upload.array('image', 1), controller.image_upload);

module.exports = router;
