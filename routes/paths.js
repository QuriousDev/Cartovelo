var controller = require('../controllers/paths');
var express = require('express');
var router = express.Router();

router.get('/paths', controller.paths);
router.get('/paths/get/:city/:activity', controller.city_activity)
router.get('/paths/list/:type', controller.list_available)

module.exports = router;
