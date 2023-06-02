/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('lessons').del();
  await knex('lessons').insert([
    { id: 1, title: 'Programming', date: '03-06-2023' },
    { id: 2, title: 'Art', date: '05-06-2023' },
    { id: 3, title: 'Math', date: '06-07-2023' },
  ]);
};
