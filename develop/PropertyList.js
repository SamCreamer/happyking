/**
* Happy King
* Author: Sam Creamer
*/

const Property = require('./Property');

module.exports = [
  //new Property(id, name, cost, costMultiplier, workValue, description, eligibility, count)
  new Property(0, 'Farm', 10, 1.05, 1,'Buy more farms to harvest more crops', 0, 1),
  new Property(1, 'General Store', 1000, 1.1, 20,'Buy a general store to earn some gold', 0, 0),
  new Property(2, 'Sword Sharpening Store', 10000, 1.2, 100, 'Sharpen swords for other people in the kingdom!', 0, 0)
];
