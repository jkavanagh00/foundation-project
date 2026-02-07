/** @format */

const express = require("express");
const router = express.Router();
const db = require("../db");
//Get all decks
router.get("/", async (req, res) => {
  const decks = await db("decks");
  res.json(decks);
});
//GET one deck
router.get("/:id", async (req, res) => {
  const deck = await db("decks").where({ id: req.params.id }).first();
  res.json(deck);
});
//CREATE a deck
router.post("/", async (req, res) => {
  const { name, description } = req.body;
  const [id] = await db("decks").insert({ name, description });
  res.json({ id, name, description });
});
module.exports = router;
