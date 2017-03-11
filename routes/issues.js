var controller = require('../controllers/issues');
var express = require('express');
var router = express.Router();

router.get('/issues', controller.issues_list);
router.post('/issues/submit', controller.create);

module.exports = router;