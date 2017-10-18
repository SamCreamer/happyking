/**
* Happy King
* Author: Sam Creamer
*/

const Game = require('./Game');

const game = new Game();

if (localStorage.getItem('saved')) {
  game.load();
}

game.start();

window.setInterval(function () {
  game.gameLoop();
}, 1000);
