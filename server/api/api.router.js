'use strict';

var router = require('express').Router();

router.use(function(req, res, next) {
	if(!req.user) res.status(404).end();
	else next();
});

router.use('/users', require('./users/user.router'));

router.use('/stories', require('./stories/story.router'));

module.exports = router;