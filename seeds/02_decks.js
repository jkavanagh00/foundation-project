/** @format */

exports.seed = async function (knex) {
  await knex("decks").del();
  await knex("decks").insert([
    { id: 1, name: "classic" },
    { id: 2, name: "colors" },
    { id: 3, name: "numbers" },
    { id: 4, name: "playing-cards" },
  ]);
};
