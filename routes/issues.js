
var controller = require('../controllers/issues')
var express = require('express');
var router = express.Router();

router.get('/issues', controller.issues_list);

module.exports = router;
