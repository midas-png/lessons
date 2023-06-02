const Router = require('express');
const router = new Router();
const LessonsController = require('../../controllers/lessonsController');
const { lessonsGetValidation, lessonsPostValidation } = require('./validation');

router.get('/', lessonsGetValidation, LessonsController.getLessons);
router.post('/lessons', lessonsPostValidation, LessonsController.createLesson);

module.exports = router;
