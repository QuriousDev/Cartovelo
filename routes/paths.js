var controller = require('../controllers/paths');
var express = require('express');
var router = express.Router();

router.get('/paths', controller.paths);
router.get('/paths/:city/:activity', controller.city_activity)

module.exports = router;
