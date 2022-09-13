const passport = require('passport');
const httpStatus = require('http-status');
const AppError = require('../utils/AppError');
const { roleRights } = require('../config/roles');
const createResponse = require('../utils/response');
const jwt = require('jsonwebtoken');

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
	// console.log(err)
	// console.log(user)
	if (err || info || !user) {

		return reject(new AppError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
	}
	req.user = user;
	if (requiredRights.length) {
		const userRights = roleRights.get(user.role);
		const hasRequiredRights = requiredRights.every(requiredRight => userRights.includes(requiredRight));
		if (!hasRequiredRights && req.params.userId !== user.id) {
			return reject(new AppError(httpStatus.FORBIDDEN, 'Not allowed to do this action.'));
		}
	}
	resolve();
};
const auth = (...requiredRights) => async (req, res, next) => {
	console.log(req.headers);
	const bearerHeader = req.headers['Authorization'];
	console.log(bearerHeader,"bearerHeader");
	if (typeof bearerHeader !== 'undefined') {
		const bearer = bearerHeader.split(' ');
		const bearerToken = bearer[1];
		req.token = bearerToken;
		jwt.verify(bearerToken, 'sdsdsd', (err, authData) => {
			if (err)
				createResponse(res, httpStatus.UNAUTHORIZED, 'Please authenticate', {});
			else {
				if (requiredRights.length) {
					const userRights = roleRights.get(authData.sUserRole);
					const hasRequiredRights = requiredRights.every(requiredRight => userRights.includes(requiredRight));
					if (!hasRequiredRights) {
						createResponse(res, httpStatus.FORBIDDEN, 'Not allowed to do this action.', {});
					}
					next();
				}
			}
		})
	} else {
		createResponse(res, httpStatus.UNAUTHORIZED, 'Please authenticate', {});
	}
};

module.exports = auth;
