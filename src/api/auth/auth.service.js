const moment = require('moment');
const bcrypt = require('bcrypt');
const config = require('../../config/config');
const { Userdata,Categorydata,Productdata } = require('../../models');
const AppError = require('../../utils/AppError');
const httpStatus = require('http-status');
const Messages = require('../../utils/messages');

const emailCheck = async (email, sUserRole) => {
	let user = await Userdata.findOne({ sEmail: email, sUserRole: sUserRole })
	if (user) {
		if (user.status === "Active") {
			throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, Messages.EMAIL_EXITS);
		} else if (user.status === "Inactive") {
			throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, Messages.DIACTIVE_USER);
		} else if (user.status === "Deleted") {
			throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, Messages.DELETE_ACCOUNT);
		}
	}
	return user;
};
const register = async (data) => {
	await emailCheck(data.sEmail, data.sUserRole)
	const user = await Userdata(data).save();
	return user
}
const checkPassword = async (password, correctPassword) => {
	const isPasswordMatch = await bcrypt.compare(password, correctPassword);
	if (!isPasswordMatch) {
		throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, Messages.PASSWORD_INCORRECT);
	}
};
const Login = async (email, password, role) => {
	try {
		let user = await Userdata.findOne({ sEmail: email, sUserRole: role })
		if (user) {
			await checkPassword(password, user.sPassword);
			return user
		} else {
			throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, Messages.EMAIL_NOT_FOUND);
		}
	} catch (error) {
		throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, Messages.EMAIL_NOT_FOUND);
	}
};
const userList = async (params) => {
	try {
		let searchfilter = {};
		const searchFields = ["sEmail"];
		if (params.search) {
			searchfilter["$or"] = searchFields.map((field) => ({
				[field]: { $regex: params.search, $options: "i" },
			}));
		}
		var aggregate = Userdata.aggregate([
			{
				$match: searchfilter
			},
			{
				$match: {
					sUserRole: "User"
				}
			},
			{
				$match: {
					status: {
						'$ne': 'Delete'
					}
				}
			},
			{
				$sort: {_id:-1}
			},
			{
				$skip: params.skip ? parseInt(params.skip) : 0
			},
			{
				$limit: params.limit ? parseInt(params.limit) : 10
			},

		]);
		return aggregate;
	} catch (error) {
		console.log(error);
		throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, Messages.EMAIL_NOT_FOUND);
	}
};

const addCategory = async (data) => {
	try {
		let user = await Categorydata.findOne({ sName: data.sName})
		if (!user) {
			return await Categorydata(data).save();
		} else {
			throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, Messages.CATEGORY_EXITS);
		}
	} catch (error) {
		throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, Messages.CATEGORY_EXITS);
	}
};

const addProduct = async (data) => {
	try {
		return await Productdata(data).save();
	} catch (error) {
		throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, Messages.ADD_PRODUCT);
	}
};
const updateProduct = async (id,data) => {
	try {
		return await Productdata.findByIdAndUpdate(id,data,{new:true});
	} catch (error) {
		throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, Messages.UPDATE_PRODUCT);
	}
};
const productList = async (params) => {
	try {
		let searchfilter = {};
		const searchFields = ["sName","category.sName"];
		if (params.search) {
			searchfilter["$or"] = searchFields.map((field) => ({
				[field]: { $regex: params.search, $options: "i" },
			}));
		}
		var aggregate = Productdata.aggregate([
			
			{
				$match: {
					status: {
						'$ne': 'Delete'
					}
				}
			},
			{
				$sort: {_id:-1}
			},
			{$lookup:{
				from: 'categories',
				localField: 'oCategory',
				foreignField: '_id',
				as: 'category'
			  }},
			  {$unwind:'$category'},
			  {
				$match: searchfilter
			},
			{
				$skip: params.skip ? parseInt(params.skip) : 0
			},
			{
				$limit: params.limit ? parseInt(params.limit) : 10
			},
			
		]);
		return aggregate;
	} catch (error) {
		console.log(error);
		throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, Messages.EMAIL_NOT_FOUND);
	}
};

module.exports = {
	register,
	Login,
	userList,
	addCategory,
	addProduct,
	updateProduct,
	productList
};
