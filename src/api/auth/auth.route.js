const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('./auth.validation');
const authController = require('./auth.controller');

// const upload = require('../../config/multer');
const auth = require('../../middlewares/auth');
const router = express.Router();

/**
 * @swagger
 * definitions:
 *   register:
 *     required:
 *       - sFullname
 *       - sEmail
 *       - sPassword
 *       - sUserRole
 *     properties:
 *       sFullname:
 *         type: string
 *         example: test
 *       sEmail:
 *         type: string
 *         example: xyz@domain.com
 *       sPassword:
 *         type: string
 *         example: Test@123
 *       sUserRole:
 *         type: string
 *         example: User
 */

/**
 * @swagger
 *
 * /auth/register:
 *   post:
 *     tags:
 *       - "Auth"
 *     description: register to the application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: Email and password for login.
 *         in: body
 *         required: true
 *         schema:
 *           $ref: "#/definitions/register"
 *     responses:
 *       200:
 *         description: You have successfully register!!
 */

router.post('/register', validate(authValidation.register), authController.register);
/**
 * @swagger
 * definitions:
 *   login:
 *     required:
 *       - sEmail
 *       - sPassword
 *       - sUserRole
 *     properties:
 *       sEmail:
 *         type: string
 *         example: xyz@domain.com
 *       sPassword:
 *         type: string
 *         example: Test@123
 *       sUserRole:
 *         type: string
 *         example: User
 */

/**
 * @swagger
 *
 * /auth/login:
 *   post:
 *     tags:
 *       - "Auth"
 *     description: Login to the application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: Email and password for login.
 *         in: body
 *         required: true
 *         schema:
 *           $ref: "#/definitions/login"
 *     responses:
 *       200:
 *         description: You have successfully logged in!!
 */

router.post('/login', validate(authValidation.login), authController.login);
/**
 * @swagger
 *
 * /auth/userList:
 *   get:
 *     tags:
 *       - "Auth"
 *     description: Login to the application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: search
 *         description: Email and password for login.
 *         in: query
 *     responses:
 *       200:
 *         description: You have successfully logged in!!
 */
router.get('/userList', auth('userlist'), authController.userList);
router.post('/category', auth('category'), authController.categoryAdd);
router.post('/addProduct', auth('product'), authController.productAdd);
router.put('/updateProduct/:id', auth('product'), authController.productupdate);
router.get('/productList', auth('productlist'), authController.productList);

module.exports = router;
