/** @format */

const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const leaderboardRouter = require("./routes/leaderboard");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

//routes would go here
app.use("/decks", require("./routes/decks"));
app.use("/cards", require("./routes/cards"));
app.use("/games", require("./routes/games"));
app.use("/leaderboard", leaderboardRouter);
app.use("/game-cards", require("./routes/gameCards"));

module.exports = app;
