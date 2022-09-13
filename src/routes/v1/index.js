const express = require('express');
const publicRoute = require('./public.route');
const apiDocsRoute = require('./api-docs.route');
const authRoute = require('../../api/auth/auth.route');


const router = express.Router();

router.use('/', publicRoute);
router.use('/api-docs', apiDocsRoute);
router.use('/auth', authRoute);

module.exports = router;
