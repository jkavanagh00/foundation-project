/** @format */

exports.seed = async function (knex) {
  await knex("cards").del();

  const cards = [];
  //Generate 10 cards for each of the 10 decks
  for (let deckId = 1; deckId <= 10; deckId++) {
    for (let i = 1; i <= 10; i++) {
      cards.push({
        deck_id: deckId,
        question: `question ${i} for deck ${deckId}`,
        answer: `answer ${i} for deck ${deckId}`,
      });
    }
  }
  //Insert all generated cards
  await knex("cards").insert(cards);
  /*
    {
      deck_id: 1,
      question: "what process makes food in plants?",
      answer: "photosynthesis",
    },
    { deck_id: 1, question: "what part absorbs water?", answer: "roots" },
    { deck_id: 1, question: "what part makes seeds?", answer: "flowers" },

    {
      deck_id: 2,
      question: "what process do animals use to get energy?",
      answer: "cellular respiration",
    },
    {
      deck_id: 2,
      question: "what part of the body pumps blood?",
      answer: "heart",
    },
  ]);

*/
};
