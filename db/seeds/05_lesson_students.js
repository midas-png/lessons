/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('lesson_students').del();
  await knex('lesson_students').insert([
    { id: 1, lesson_id: 1, student_id: 1 },
    { id: 2, lesson_id: 1, student_id: 2 },
    { id: 3, lesson_id: 1, student_id: 3 },
    { id: 4, lesson_id: 2, student_id: 1 },
    { id: 5, lesson_id: 2, student_id: 3 },
    { id: 6, lesson_id: 3, student_id: 1 },
    { id: 7, lesson_id: 3, student_id: 2 },
    { id: 8, lesson_id: 3, student_id: 3 },
  ]);
};
