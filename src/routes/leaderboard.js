/** @format */

const express = require("express");
const router = express.Router();
const db = require("../db");
router.get("/leaderboard", async (req, res) => {
  try {
    const leaderboard = await db("players")
      .leftJoin("games", "players.id", "games.player_id")
      .select(
        "players.name as name",
        db.raw("coalesce(sum(games.score),0) as total_score"),
        db.raw("coalesce(count(games.id),0) as games_played"),
        db.raw("coalesce(max(games.score),0) as best_score"),
      )
      .groupBy("players.id", "players.name")
      .orderBy("total_score", "desc");
    res.json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load leaderboard" });
  }
});
module.exports = router;
