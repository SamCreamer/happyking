/**
 * Property waterfall test
 */

const UI = require('../develop/Ui');
const Property = require('../develop/Property');

const properties = [
  //new Property(id, name, cost, costMultiplier, workValue, description, count)
  new Property(0, 'test1', 100, 1.5, 100, 'desk', 1),
  new Property(1, 'test2', 200, 1.5, 100, 'desk', 0),
  new Property(2, 'test3', 300, 1.5, 100, 'desk', 0),
  new Property(3, 'test4', 400, 1.5, 100, 'desk', 0),
  new Property(4, 'test5', 500, 1.5, 100, 'desk', 0),
  new Property(5, 'test6', 600, 1.5, 100, 'desk', 0)
];
