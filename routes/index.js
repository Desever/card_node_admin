//var express = require('express');
//var router = express.Router();
//
///* GET home page. */
//router.get('/', function(req, res, next) {
//res.render('index', { title: 'Express' });
//});
//
//module.exports = router;


module.exports = function(app) {
	/**
	 * 进入首页
	 */
	app.get('/', function (req, res) {
		res.render('index', { title: 'Express' });
	});
	
};

