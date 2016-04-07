'use strict';

var router = require('express').Router(),
	_ = require('lodash');

var HttpError = require('../../utils/HttpError');
var User = require('./user.model');

router.param('id', function (req, res, next, id) {
	User.findById(id).exec()
	.then(function (user) {
		if (!user) throw HttpError(404);
		req.requestedUser = user;
		next();
	})
	.then(null, next);
});

router.get('/', function (req, res, next) {
	User.find({}).exec()
	.then(function (users) {
		users = users.map(function (user) {
			return {
				_id: user._id,
				name: user.name,
				email: user.email,
				phone: user.phone,
				photo: user.photo,
				password: "Can\'t touch this",
				isAdmin: user.isAdmin
			};
		});
		res.json(users);
	})
	.then(null, next);
});

router.post('/', function (req, res, next) {
	User.create(req.body)
	.then(function (user) {
		res.status(201).json(user);
	})
	.then(null, next);
});

router.get('/:id', function (req, res, next) {
	req.requestedUser.getStories()
	.then(function (stories) {
		var obj = req.requestedUser.toObject();
		obj.stories = stories;
		obj.password = "Can't touch this";
		res.json(obj);
	})
	.then(null, next);

});

router.put('/:id', function (req, res, next) {
	_.extend(req.requestedUser, req.body);
	req.requestedUser.save()
	.then(function (user) {
		res.json(user);
	})
	.then(null, next);
});

router.delete('/:id', function (req, res, next) {
	if (!req.user.isAdmin) res.status(404).end();
	else {
		req.requestedUser.remove()
		.then(function () {
			res.status(204).end();
		})
		.then(null, next);
	}
});

module.exports = router;