var controller = require('../controllers/issues');
var express = require('express');
var router = express.Router();
// multer-s3 img
var aws = require('../helpers/s3.js')
var upload = aws.getUploadMulterS3()

router.get('/issues', controller.issues_list);
router.post('/issues/submit', controller.create);
router.post('/issues/:id/image', upload.array('image', 1), controller.image_upload)
router.put('/issues/:id', controller.update);

module.exports = router;
