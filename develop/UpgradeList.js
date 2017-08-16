/**
* Happy King
* Author: Sam Creamer
*/

const Upgrade = require('./Upgrade');

module.exports = [
  // new Upgrade(id, propId, name, cost, workValue, workValueMultiplier, description, eligibility)
  new Upgrade(0, 0,'corn', 10, 0, 1.5, 'Learn how to farm corn - add 50% to your farming output', 0)
];
