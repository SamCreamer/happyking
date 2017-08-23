/**
* Happy King
* Author: Sam Creamer
*/

const Worker = require('./Worker');

module.exports = [
  //new Worker(id, propId, name, cost, description, eligibility)
  new Worker(0, 0, 'Noob Farmer', 10, 'Will work your farms once every 5 seconds', 0, 5),
  new Worker(1, 1, 'Young Store Clerk', 10, 'Will work the stores once every 8 seconds', 0, 8),
  new Worker(2, 2, 'Apprentice Sword Sharpener', 10, 'Runs the sword sharpening shops, once per 8 seconds', 0, 8),
  new Worker(3, 0, 'Student Farmer', 10, 'A student, studying farms. Works once per 2 seconds', 0, 2),
  new Worker(4, 3, 'Small Inn Clerk', 10, 'Will work the Small Inns once every 5 seconds', 0, 5),
  new Worker(5, 4, 'Rookie Brew Master', 10, 'Will make some beer every 8 seconds', 0, 8)
];
