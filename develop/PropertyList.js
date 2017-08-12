/**
* Happy King
* Author: Sam Creamer
*/

const Property = require('./Property');

module.exports = [
  //new Property(id, name, cost, costMultiplier, goldPerSecond, workValue, description, eligibility, count)
  new Property(0, 'Farm', 10, 1.05, 0, 1,'Buy more farms to harvest more crops', 0, 1)
];
