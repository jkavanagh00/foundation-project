/** @format */
exports.seed = async function (knex) {
  await knex("game_cards").del();
  const gameCards = [];
  const games = await knex("games").select("id", "deck_id");
  const cards = await knex("cards").select("id", "deck_id");
  for (const game of games) {
    const deckCards = cards.filter((card) => card.deck_id === game.deck_id);
    for (const card of deckCards) {
      gameCards.push({
        game_id: game.id,
        card_id: card.id,
        correct: Math.random() < 0.5, // random true/false
      });
    }
  }
  await knex("game_cards").insert(gameCards);
};
/*
  ([
    //Game 1
    { game_id: 1, card_id: 1, correct: true },
    { game_id: 1, card_id: 2, correct: false },
    { game_id: 1, card_id: 3, correct: true },
    //Game 2
    { game_id: 2, card_id: 1, correct: false },
    { game_id: 2, card_id: 2, correct: true },
    { game_id: 2, card_id: 3, correct: false },
    //Game 3
    { game_id: 3, card_id: 1, correct: true },
    { game_id: 3, card_id: 2, correct: true },
    { game_id: 3, card_id: 3, correct: true },
    //Game 4
    { game_id: 4, card_id: 1, correct: true },
    { game_id: 4, card_id: 2, correct: false },
    //Game 5
    { game_id: 5, card_id: 1, correct: false },
    { game_id: 5, card_id: 2, correct: true },
  ]);
};
*/
