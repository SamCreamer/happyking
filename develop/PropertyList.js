/**
* Happy King
* Author: Sam Creamer
*/

const Property = require('./Property');

module.exports = [
  //new Property(id, name, cost, costMultiplier, workValue, description, count)
  new Property(0, 'Small Farm', 10, 1.15, 1,'Buy more farms to harvest more crops', 1),
  new Property(1, 'General Store', 1000, 1.1, 20,'Buy a general store to earn some gold', 0),
  new Property(2, 'Sword Sharpening Store', 10000, 1.2, 100, 'Sharpen swords for other people in the kingdom!', 0),
  new Property(3, 'Small Inn', 120000, 1.2, 2500, 'Let guests spend the night in your comfortable Inn', 0),
  new Property(4, 'Brewery', 2000000, 1.2, 19000, 'Everyone loves beer! Brew it for them', 0),
  new Property(5, 'Big Farm', 4000000, 1.5, 46000, 'You can farm more stuff here!', 0),
  new Property(6, 'Circus', 10000000, 1.45, 80000, 'Entertain the folks with circus acts', 0),
  new Property(7, 'Local Pub', 18000000, 1.5, 260000, 'The ultimate local business', 0),
  new Property(8, 'Apothecary', 40000000, 1.2, 500000, 'The old school pharmacy', 0),
  new Property(9, 'Art Studio', 100000000, 1.7, 1200000, 'Being an artist made people rich back in the day', 0),
  new Property(10, 'Big Inn', 50000000, 1.9, 4000000, 'A huge inn that holds thousands of peasant guests', 0),
  new Property(11, 'Massive Farm', 120000000, 2, 10000000, 'An absolutely massive farm. Farms all kinds of shit', 0),
  new Property(12, 'Small Chapel', 400000000, 1.5, 22000000, 'People love praying. They pay membership fees to your chapel!', 0),
  new Property(13, 'Bronze Mine', 1000000000, 1.8, 70000000, 'The era of precious metals is upon us! Mine some bronze', 0),
  new Property(14, 'Armory', 6000000000, 1.6, 170000000, 'Buy an armory to train workers and conquer land. It makes you rich', 0)
];
