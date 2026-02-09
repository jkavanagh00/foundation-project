import Game from "./game.js"

const game = new Game(8);
game.populateCardGrid(game.initialiseCardArray(game.cards));

// makes game class accessible to the DOM so that onclick handlers can access it;
window.game = game;