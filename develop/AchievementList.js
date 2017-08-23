/**
* Happy King
* Author: Sam Creamer
*/

const Achievement = require('./Achievement');

module.exports = [
  // new Achievement(id, name, description, criteria)
  new Achievement(0, 'Earn 10 Gold', 'You earned 10 gold... now earn more', (game) => game.gold >= 10)
];
