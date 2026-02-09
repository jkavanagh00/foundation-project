/** @format */

exports.seed = async function (knex) {
  await knex("games").del();
  
  const games = [];
  
  // Generate 50 games for 5 players, using only deck_id 1-4
  for (let playerId = 1; playerId <= 5; playerId++) {
    for (let i = 0; i < 10; i++) {
      games.push({
        id: (playerId - 1) * 10 + i + 1,
        player_id: playerId,
        deck_id: (i % 4) + 1, // Cycles through deck_id 1, 2, 3, 4
        score: Math.floor(Math.random() * 25),
        started_at: knex.fn.now(),
        ended_at: knex.fn.now(),
      });
    }
  }
  
  await knex("games").insert(games);
};
