/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('teachers').del();
  await knex('teachers').insert([
    { id: 1, name: 'John' },
    { id: 2, name: 'Elsa' },
    { id: 3, name: 'Elon' },
  ]);
};
