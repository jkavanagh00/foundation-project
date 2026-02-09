/** @format */

const express = require("express");
const router = express.Router();
const db = require("../db");
//GET cards for a deck
router.get("/deck/:deckId", async (req, res) => {
  const cards = await db("cards").where({
    deck_id: req.params.deckId,
  });
  res.json(cards);
});
//CREATE a card
router.post("/", async (req, res) => {
  const { deck_id, front, back } = req.body;
  const [id] = await db("cards").insert({ deck_id, front, back });
  res.json({ id, deck_id, front, back });
});
module.exports = router;
