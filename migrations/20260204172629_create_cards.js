/**
 * @format
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function (knex) {
  return knex.schema.createTable("cards", function (table) {
    table.increments("id").primary();
    table
      .integer("deck_id")
      .unsigned()
      .references("id")
      .inTable("decks")
      .onDelete("CASCADE");

    table.string("question").notNullable();
    table.string("answer").notNullable();
    //table.string("front").notNullable();
    //table.string("back").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("cards");
};
