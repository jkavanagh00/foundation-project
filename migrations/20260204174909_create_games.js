/**
 * @format
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function (knex) {
  return knex.schema.createTable("games", function (table) {
    table.increments("id").primary();
    table
      .integer("deck_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("decks")
      .onDelete("CASCADE");
    table.integer("score").defaultTo(0);
    table.timestamp("started_at").defaultTo(knex.fn.now());
    table.timestamp("ended_at");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("games");
};
