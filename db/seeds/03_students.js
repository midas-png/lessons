/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('students').del();
  await knex('students').insert([
    { id: 1, name: 'Elton' },
    { id: 2, name: 'Andrew' },
    { id: 3, name: 'Harry' },
  ]);
};
