/**
* Happy King
* Author: Sam Creamer
*/


const numberformat = require('swarm-numberformat')

/**
* This module is for strictly UI related things
*/
module.exports = class UI {
  /**
  * Updates the property count in the UI
  */
  static updatePropertyCountUI(property) {
    const el = document.querySelector('[data-propid-container="' + property.id + '"]').querySelector('.property-count');
    el.innerHTML = numberformat.format(property.count);
  }

  /**
  * Update property cost in the UI
  */
  static updatePropertyCostUI(property) {
    const el = document.querySelector('[data-propid-container="' + property.id + '"]').querySelector('.property-cost');
    el.innerHTML = numberformat.format(property.cost);
  }

  /**
   * Adds achievement to the UI
   * @param {object} achievement
   */
  static addAchievement(achievement, achievementDiv) {
    const template = document.getElementById('achievement_template').content;

    template.querySelector('.achievement-name').innerHTML = achievement.name;
    template.querySelector('.achievement-desc').innerHTML = achievement.description;

    const clone = document.importNode(template, true);
    achievementDiv.appendChild(clone);
  }

}
