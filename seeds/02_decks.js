/** @format */

exports.seed = async function (knex) {
  await knex("decks").del();
  await knex("decks").insert([
    { id: 1, name: "plants" },
    { id: 2, name: "animals" },
    { id: 3, name: "countries" },
    { id: 4, name: "sports" },
    { id: 5, name: "technology" },
    { id: 6, name: "art" },
    { id: 7, name: "geography" },
    { id: 8, name: "science" },
    { id: 9, name: "math" },
    { id: 10, name: "language" },
  ]);
};
