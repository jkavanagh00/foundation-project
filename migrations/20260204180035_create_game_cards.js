/**
 * @format
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function (knex) {
  return knex.schema.createTable("game_cards", function (table) {
    table.increments("id").primary();
    table
      .integer("game_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("games")
      .onDelete("CASCADE");
    table
      .integer("card_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("cards")
      .onDelete("CASCADE");
    table.boolean("correct").defaultTo(false);
    table.timestamp("answered_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("game_cards");
};
