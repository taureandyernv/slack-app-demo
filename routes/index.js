var express = require('express');
var router = express.Router();
const config = require('../config');
const port = config.serverPort || 80;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
module.exports = router;
