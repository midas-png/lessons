const ApiError = require('../errorApi');
const knex = require('../db/knex');
const { validationResult } = require('express-validator');

class LessonsController {
  async getLessons(req, res, next) {
    try {
      let { date, status, teacherIds, studentsCount } = req.body;
      const errors = validationResult(req);
      let { page, lessonsPerPage } = req.query;
      page = page || 1;
      lessonsPerPage = lessonsPerPage || 5;
      const offset = (page - 1) * lessonsPerPage;

      if (!errors.isEmpty()) {
        const errorMessage = errors.array().map((error) => {
          return error.msg;
        });
        return next(ApiError.badRequest(errorMessage));
      }

      const lessonsQuery = knex('lessons')
        .select('lessons.id', 'date', 'title', 'status')
        .count('lesson_students.student_id as visitCount')
        .leftJoin('lesson_students', 'lessons.id', 'lesson_students.lesson_id')
        .groupBy('lessons.id', 'date', 'title', 'status');

      if (date) {
        if (date.includes(',')) {
          const [startDate, endDate] = date.split(',');
          lessonsQuery.whereBetween('date', [startDate, endDate]);
        } else {
          lessonsQuery.where('date', date);
        }
      }

      if (status) {
        lessonsQuery.where('status', status);
      }

      if (teacherIds) {
        const ids = teacherIds.split(',');
        lessonsQuery
          .innerJoin(
            'lesson_teachers',
            'lessons.id',
            'lesson_teachers.lesson_id',
          )
          .whereIn('lesson_teachers.teacher_id', ids);
      }

      const lessons = await lessonsQuery.offset(offset).limit(lessonsPerPage);

      let result = await Promise.all(
        lessons.map(async (lesson) => {
          const students = await knex('lesson_students')
            .select('students.id', 'name', 'visit')
            .leftJoin('students', 'lesson_students.student_id', 'students.id')
            .where('lesson_id', lesson.id);

          const teachers = await knex('lesson_teachers')
            .select('teachers.id', 'name')
            .leftJoin('teachers', 'lesson_teachers.teacher_id', 'teachers.id')
            .where('lesson_id', lesson.id);

          return {
            ...lesson,
            visitCount: students.length,
            students,
            teachers,
          };
        }),
      );

      if (studentsCount) {
        if (studentsCount.includes(',')) {
          const [minCount, maxCount] = studentsCount.split(',');
          result = result.filter(
            ({ visitCount }) =>
              visitCount <= maxCount || visitCount >= minCount,
          );
        } else {
          result = result.filter(
            ({ visitCount }) => visitCount == studentsCount,
          );
        }
      }

      return res.json(result);
    } catch (e) {
      return next(ApiError.internal(e.message));
    }
  }

  async createLesson(req, res, next) {
    try {
      let { teacherIds, title, days, firstDate, lessonsCount, lastDate } =
        req.body;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const errorMessage = errors.array().map((error) => {
          return error.msg;
        });
        return next(ApiError.badRequest(errorMessage));
      }

      let limitDate = new Date(firstDate);
      limitDate.setFullYear(limitDate.getFullYear() + 1);

      if (lessonsCount) {
        lessonsCount = Math.min(lessonsCount, 300);
      } else {
        let diff = Math.ceil(
          (new Date(lastDate) - new Date(firstDate)) / (1000 * 60 * 60 * 24),
        );
        lessonsCount = Math.min(Math.ceil(diff / 7) * days.length, 300);
      }

      let dates = [];
      let current = new Date(firstDate);
      while (dates.length < lessonsCount && current < limitDate) {
        if (days.includes(current.getUTCDay())) {
          dates.push(current.toISOString().substr(0, 10));
        }
        current.setDate(current.getDate() + 1);
      }

      let lessons = [];
      for (let date of dates) {
        let lesson = { date, title, status: 0 };
        const existingRecord = await knex('lessons').where(lesson).first();

        if (!existingRecord) {
          await knex('lessons')
            .insert(lesson)
            .returning('id')
            .then((ids) =>
              ids.map(({ id }) => {
                lessons.push(id);
              }),
            );
        } else {
          return next(ApiError.badRequest('Такое же занятие уже существует'));
        }
      }

      let lessonTeachers = [];
      for (let lesson_id of lessons) {
        for (let teacher_id of teacherIds) {
          lessonTeachers.push({
            lesson_id: Number(lesson_id),
            teacher_id: Number(teacher_id),
          });
        }
      }

      lessonTeachers.map(async ({ lesson_id, teacher_id }) => {
        const existingRecord = await knex('lesson_teachers')
          .where({
            lesson_id,
            teacher_id,
          })
          .first();

        if (!existingRecord) {
          await knex('lesson_teachers').insert({ lesson_id, teacher_id });
        } else {
          return next(ApiError.badRequest('Такое же занятие уже существует'));
        }
      });

      return res.send(lessons);
    } catch (e) {
      return next(ApiError.internal(e.message));
    }
  }
}

module.exports = new LessonsController();
