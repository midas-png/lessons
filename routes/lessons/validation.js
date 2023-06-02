const { body, query } = require('express-validator');

const lessonsGetValidation = [
  body('date')
    .optional()
    .isDate()
    .withMessage('date должен быть в формате YYYY-MM-DD'),
  body('status')
    .optional()
    .isIn(['0', '1'])
    .withMessage('status должен быть 0 или 1'),
  body('teacherIds')
    .optional()
    .matches(/^\d+(,\d+)*$/)
    .withMessage('teacherIds должен состоять из цифр, разделенных запятыми'),
  body('studentsCount')
    .optional()
    .matches(/^(\d+|\d{2})(,\d+)?$/)
    .withMessage(
      'studentsCount должен быть цифрой или двумя цифрами, разделенных запятой',
    ),
  query('page').optional().isInt().withMessage('page должен быть цифрой'),
  query('lessonsPerPage')
    .optional()
    .isInt()
    .withMessage('lessonsPerPage должен быть цифрой'),
];

const lessonsPostValidation = [
  body('teacherIds')
    .isArray({ min: 1 })
    .withMessage('TeacherIds должен быть не пустым массивом чисел'),
  body('title').isString().withMessage('Title должен быть строкой'),
  body('days')
    .isArray({ min: 1, max: 7 })
    .withMessage('days должен быть не пустым массивом с макс. длинной - 7'),
  body('days.*')
    .isInt({ min: 0, max: 6 })
    .withMessage('число в days должно быть от 0 до 6'),
  body('firstDate')
    .isDate()
    .withMessage('firstDate должен быть в формате YYYY-MM-DD'),
  body('lastDate')
    .optional()
    .isDate()
    .withMessage('lastDate должен быть в формате YYYY-MM-DD'),
  body().custom((_, { req }) => {
    const { firstDate, lastDate, lessonsCount } = req.body;
    if (lastDate && firstDate && new Date(lastDate) < new Date(firstDate)) {
      throw new Error('lastDate должен быть позже firstDate');
    }
    if (lessonsCount && lastDate) {
      throw new Error('lessonsCount и lastDate - взаимоисключающие параметры');
    }
    return true;
  }),
  body('lessonsCount')
    .optional()
    .isInt({ min: 1 })
    .withMessage('lessonsCount должен быть числом больше 1'),
];

module.exports = { lessonsGetValidation, lessonsPostValidation };
