/**
* Happy King
* Author: Sam Creamer
*/

const Property = require('../develop/Property');

module.exports = [
  //new Property(id, name, cost, costMultiplier, workValue, description, count)
  new Property(0, 'Small Farm', 1, 1.3, 1,'Buy more farms to harvest more crops', 1),
  new Property(1, 'General Store', 10, 1.1, 20,'Buy a general store to earn some gold', 0),
  new Property(2, 'Sword Sharpening Store', 100, 1.2, 100, 'Sharpen swords for other people in the kingdom!', 0),
  new Property(3, 'Small Inn', 1000, 1.2, 2500, 'Let guests spend the night in your comfortable Inn', 0),
  new Property(4, 'Brewery', 10000, 1.2, 19000, 'Everyone loves beer! Brew it for them', 0),
  new Property(5, 'Big Farm', 100000, 1.5, 46000, 'You can farm more stuff here!', 0),
  new Property(6, 'Circus', 1000000, 1.45, 80000, 'Entertain the folks with circus acts', 0),
  new Property(7, 'Local Pub', 10000000, 1.5, 260000, 'The ultimate local business', 0),
  new Property(8, 'Apothecary', 100000000, 1.2, 500000, 'The old school pharmacy', 0),
];
