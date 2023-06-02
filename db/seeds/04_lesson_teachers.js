/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('lesson_teachers').del();
  await knex('lesson_teachers').insert([
    { id: 1, lesson_id: 1, teacher_id: 1 },
    { id: 2, lesson_id: 2, teacher_id: 2 },
    { id: 3, lesson_id: 2, teacher_id: 3 },
    { id: 4, lesson_id: 3, teacher_id: 3 },
  ]);
};
