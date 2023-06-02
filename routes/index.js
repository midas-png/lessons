const Router = require('express');
const router = new Router();
const lessonsRouter = require('./lessons');

router.use('/', lessonsRouter);

module.exports = router;
