/**
* Happy King
* Author: Sam Creamer
*/

const Worker = require('./Worker');

module.exports = [
  //new Worker(id, propId, name, cost, description, eligibility)
  new Worker(0, 0, 'Noob Farmer', 10, 'Will work your small farms once every 5 seconds', 0, 5),
  new Worker(1, 1, 'Young Store Clerk', 10, 'Will work the stores once every 8 seconds', 0, 8),
  new Worker(2, 2, 'Apprentice Sword Sharpener', 10, 'Runs the sword sharpening shops, once per 8 seconds', 0, 8),
  new Worker(3, 0, 'Student Farmer', 10, 'A student, studying farms. Works small farms once per 2 seconds', 0, 2),
  new Worker(4, 3, 'Small Inn Clerk', 10, 'Will work the Small Inns once every 5 seconds', 0, 5),
  new Worker(5, 4, 'Rookie Brew Master', 10, 'Will make some beer every 8 seconds', 0, 8),
  new Worker(6, 5, 'Big Farm Farmer', 10, 'This guy knows his farming. Works big farms every 3 seconds', 0, 3),
  new Worker(7, 6, 'Rookie Circus Performer', 10, 'Bad circus performer. Works once every 10 seconds', 0, 10),
  new Worker(8, 7, 'Bartender', 10, 'Tends the bar every 5 seconds', 0, 5),
  new Worker(9, 8, 'Pharmacist', 10, 'Deals drugs out of your apothecary every 3 seconds', 0, 3),
  new Worker(10, 9, 'Artist', 10, 'They work slow but earn a living: once every 10 seconds', 0, 10),
  new Worker(11, 10, 'Big Inn Clerk', 10, 'Works the big inns every 4 seconds', 0, 4),
  new Worker(12, 11, 'Massive Farm Farmer', 10, 'Amazing farmer. Works the massive farms every 4 seconds', 0, 4),
  new Worker(13, 12, 'Small Chapel Preacher', 10, 'Preaches at the small chapel every 2 seconds', 0, 2),
  new Worker(14, 13, 'Amateur Bronze Miner', 10, 'Mines bronze every 10 seconds', 0, 10),
  new Worker(15, 14, 'Armory Employee', 10, 'Runs the armory every 10 seconds', 0, 10)
];
