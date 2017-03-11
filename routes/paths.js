var controller = require('../controllers/paths');
var express = require('express');
var router = express.Router();

router.get('/paths', controller.paths);

module.exports = router;
