/**
* Happy King
* Author: Sam Creamer
*/

const Game = require('./Game');

const game = new Game();

window.setInterval(function () {
  game.gameLoop();
}, 1000);
