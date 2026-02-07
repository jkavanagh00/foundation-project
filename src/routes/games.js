/** @format */

const express = require("express");
const router = express.Router();
const db = require("../db");
//START a game
router.post("/", async (req, res) => {
  const { deck_id, player_name } = req.body;
  if (!deck_id || !player_name) {
    return res
      .status(400)
      .json({ error: "deck_id and player_name are required" });
  }
  try {
    //check if player already exists
    let player = await db("players").where({ name: player_name }).first();
    //if not, create a new player
    if (!player) {
      const [newPlayerID] = await db("players").insert({ name: player_name });
      player = { id: newPlayerID, name: player_name };
    }
    //create a new game linked to this player
    const [gameID] = await db("games").insert({
      deck_id,
      player_id: player.id,
      started_at: db.fn.now(),
      score: 0,
    });
    // Response with game + player info
    res.json({
      message: "Game started",
      game_id: gameID,
      player_id: player.id,
      player_name: player.name,
      deck_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to start game" });
  }
});
module.exports = router;

/*
//END a game(automatic scoring)
router.patch("/:id", async (req, res) => {
  const gameID = req.params.id;
 //count correct answers
    const [{ correct_count }] = await db("game_cards")
      .where({ game_id: gameID, correct: true })
      .count("* as correct_count");
    //update the game with the calculated score
    await db("games")
      .where({ id: gameID })
      .update({ score: correct_count, ended_at: db.fn.now() });
    res.json({
      message: "Game finished",
      game_id: gameID,
      score: correct_count,
    });
    
catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to finish game" });
  }
*/
