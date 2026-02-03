import Game from "./game.js"

const game = new Game(16);
game.populateCardGrid(game.initialiseCardArray(game.cards));

// makes game class accessible to the DOM so that onclick handlers can access it;
window.game = game;