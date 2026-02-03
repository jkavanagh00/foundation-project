import Game from "./game.js"

const game = new Game(8);
game.populateCardGrid(game.initialiseCardArray(game.cards));