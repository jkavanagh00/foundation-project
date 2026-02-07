/** @format */

exports.seed = async function (knex) {
  await knex("players").del();
  const players = [];
  const playerCount = 5; // how many players you want to generate
  for (let i = 1; i <= playerCount; i++) {
    players.push({
      id: i,
      name: `player${i}`, //auto-generated name
    });
  }
  await knex("players").insert(players);
};
