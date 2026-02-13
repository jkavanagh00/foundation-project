/** @format */

const express = require("express");
const router = express.Router();
const db = require("../db");
//utility: consistent error response
function sendError(res, status, message) {
  return res.status(status).json({ error: message });
}
//START a game
router.post("/", async (req, res) => {
  let { deck_id, player_name } = req.body;
  //validate deck_id
  if (deck_id === undefined || isNaN(Number(deck_id))) {
    return sendError(res, 400, "deck_id must be a numeric value");
  }
  deck_id = Number(deck_id);
  //validate player_name
  if (!player_name || typeof player_name !== "string") {
    return sendError(res, 400, "player_name is required");
  }
  player_name = player_name.trim();
  if (player_name.length === 0) {
    return sendError(res, 400, "player_name cannot be empty");
  }
  if (player_name.length > 30) {
    return sendError(res, 400, "player_name must be 30 characters or fewer");
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
    return res.json({
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
// FINISH a game (save score)
router.patch("/:id", async (req, res) => {
  const game_id = req.params.id;
  const { score } = req.body;
  //Validate game_id
  if (!game_id || isNaN(Number(game_id))) {
    return sendError(res, 400, "game_id must be numeric");
  }
  //Validate score
  if (score === undefined || typeof score !== "number" || isNaN(score)) {
    return sendError(res, 400, "A numeric'score is required");
  }
  try {
    const game = await db("games").where({ id: game_id }).first();
    if (!game) {
      return sendError(res, 400, "Game not found");
    }
    //update score + ended_at
    await db("games")
      .where({ id: game_id })
      .update({ score, ended_at: db.fn.now() });
    return res.json({
      message: "Game updated successfully",
      game_id,
      score,
    });
  } catch (error) {
    console.error("error updating game:", error);
    return sendError(res, 500, "Failed to update game");
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
