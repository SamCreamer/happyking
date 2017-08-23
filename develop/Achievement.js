/**
 * Happy King
 * Author: Sam Creamer
 */

const UI = require('./UI');

module.exports = class Achievement {
  /**
   * Achievement constructor
   * @param  {int} id          Unique ID for the achievements
   * @param  {string} name        Name of achievement
   * @param  {string} description Description of achievement
   * @param  {function} criteria takes variables and returns a boolean
   */
  constructor(id, name, description, criteria) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.criteria = criteria;
    this.achieved = false;
  }

  /**
   * When an achievement is achieved, run this to add it
   */
  earnAchievement() {
    console.log(this.name);
    this.achieved = true;
  }

};
