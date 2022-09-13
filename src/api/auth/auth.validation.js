const Joi = require('@hapi/joi');
const { ROLES } = require('../../config/constant');

const login = {
	body: Joi.object().keys({
		sEmail: Joi.string().email().required().messages({
			'string.email': 'Are you sure you entered the valid email address?',
			'string.empty': 'Email address cannot be empty.'
		}),
		sPassword: Joi.string().required().messages({
			'string.empty': 'Password cannot be empty.'
		}),
		sUserRole: Joi.string()
	}),
};
const register = {
	body: Joi.object().keys({
		sEmail: Joi.string().email().required().messages({
			'string.email': 'Are you sure you entered the valid email address?',
			'string.empty': 'Email address cannot be empty.'
		}),
		sPassword: Joi.string().required().messages({
			'string.empty': 'Password cannot be empty.'
		}),
		sUserRole: Joi.string(),
		sFullname: Joi.string()
	}),
};

module.exports = {
	login,
	register
};
