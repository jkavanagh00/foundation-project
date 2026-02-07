/** @format */

exports.seed = async function (knex) {
  await knex("games").del();
  const games = [];
  const playerCount = 5; //number of players
  const deckCount = 10; //number of decks
  let id = 1;
  for (let playerId = 1; playerId <= playerCount; playerId++) {
    for (let deckId = 1; deckId <= deckCount; deckId++) {
      games.push({
        id: id++,
        player_id: playerId,
        deck_id: deckId,
        score: Math.floor(Math.random() * 25), //random score 0-24
        started_at: knex.fn.now(),
        ended_at: knex.fn.now(),
      });
    }
  }
  await knex("games").insert(games);
};
/*
  await knex("games").insert([
    { id: 1, deck_id: 1, started_at: knex.fn.now() },
    { id: 2, deck_id: 1, started_at: knex.fn.now() },
    { id: 3, deck_id: 1, started_at: knex.fn.now() },
    { id: 4, deck_id: 2, started_at: knex.fn.now() },
    { id: 5, deck_id: 2, started_at: knex.fn.now() },
  ]);
};
*/
