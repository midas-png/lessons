/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('lessons', function (table) {
      table.increments('id');
      table.string('title').notNullable();
      table.integer('status').defaultTo(0);
      table.date('date').notNullable();
    })
    .createTable('teachers', function (table) {
      table.increments('id');
      table.string('name').notNullable();
    })
    .createTable('students', function (table) {
      table.increments('id');
      table.string('name').notNullable();
    })
    .createTable('lesson_teachers', function (table) {
      table.increments('id');
      table
        .integer('lesson_id')
        .notNullable()
        .references('id')
        .inTable('lessons');
      table
        .integer('teacher_id')
        .notNullable()
        .references('id')
        .inTable('teachers');
    })
    .createTable('lesson_students', function (table) {
      table.increments('id');
      table
        .integer('lesson_id')
        .notNullable()
        .references('id')
        .inTable('lessons');
      table
        .integer('student_id')
        .notNullable()
        .references('id')
        .inTable('students');
      table.boolean('visit').defaultTo(false);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTable('lesson_teachers')
    .dropTable('lesson_students')
    .dropTable('lessons')
    .dropTable('teachers')
    .dropTable('students');
};
