/** @format */

const express = require("express");
const router = express.Router();
const db = require("../db");
//Record a card answer
router.post("/", async (req, res) => {
  const { game_id, card_id, correct } = req.body;
  const [id] = await db("game_cards").insert({ game_id, card_id, correct });
  res.json({ id, game_id, card_id, correct });
});
module.exports = router;
