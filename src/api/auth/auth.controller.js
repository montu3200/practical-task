const catchAsync = require('../../utils/catchAsync');
const createResponse = require('../../utils/response');
const Messages = require('../../utils/messages');
const jwt = require('jsonwebtoken');
const AppError = require('../../utils/AppError');
const authService = require('./auth.service');
const httpStatus = require('http-status');

const login = catchAsync(async (req, res) => {
	try {
		let { sEmail, sPassword, sUserRole } = req.body;
		const user = await authService.Login(sEmail, sPassword, sUserRole);
		const tokens = jwt.sign({ _id: user._id, sUserRole: user.sUserRole }, process.env.JWT_SECRET)
		const response = { user: user.transform(), tokens };
		createResponse(res, httpStatus.OK, Messages.LOGIN, response)
	} catch (error) {
		throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, error.message);
	}


});
const register = catchAsync(async (req, res) => {
	try {
		const user = await authService.register(req.body)
		createResponse(res, httpStatus.OK, Messages.REGISTER, user)
	} catch (error) {
		throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, error.message);
	}

});
const userList = catchAsync(async (req, res) => {
	const UserList= await authService.userList(req.query);
	createResponse(res, httpStatus.OK, Messages.FETCHDATA, UserList)
});
const categoryAdd = catchAsync(async (req, res) => {
	const UserList= await authService.addCategory(req.body);
	createResponse(res, httpStatus.OK, Messages.FETCHDATA, UserList)
});

const productAdd = catchAsync(async (req, res) => {
	const UserList= await authService.addProduct(req.body);
	createResponse(res, httpStatus.OK, Messages.ADD_PRODUCT, UserList)
});

const productupdate = catchAsync(async (req, res) => {
	const UserList= await authService.updateProduct(req.params.id,req.body);
	createResponse(res, httpStatus.OK, Messages.UPDATE_PRODUCT, UserList)
});
const productList = catchAsync(async (req, res) => {
	const UserList= await authService.productList(req.query);
	createResponse(res, httpStatus.OK, Messages.FETCHDATA, UserList)
});

module.exports = {
	login,
	userList,
	register,
	categoryAdd,
	productAdd,
	productupdate,
	productList
};
