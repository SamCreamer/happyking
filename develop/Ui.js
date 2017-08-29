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
    if (property.locked) {
      el.innerHTML = '-';
    } else {
      el.innerHTML = numberformat.format(property.cost);
    }
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

  /**
   * Shows properties that you can buy as well as properties coming up
   * @param  {array} properties
   * @param  {html} propertyDiv
   * @param  {obj} game
   */
  static propertyUiWaterfall(properties, propertyDiv, game) {

    /**
     * Get the ones that are locked that we need to unlock first
     */
    const toUnlock = properties.filter(function (property) {
      return game.allTimeGold >= property.eligibility && property.locked;
    });

    for (let i = 0; i < toUnlock.length; i++) {
      UI.unlockProperty(toUnlock[i], propertyDiv, game);
    }

    /**
     * Next get the eligible properties and make UI elements with them. Only should really get anything here on the first iteration of this method
     * TODO: maybe improve this? This code is kinda unnecessary
     */
    const toShowAndNotLock = properties.filter(function (property) {
      return game.allTimeGold >= property.eligibility && !property.shown && !property.locked;
    });

    for (let i = 0; i < toShowAndNotLock.length; i++) {
      UI.showAndNotLockProperty(toShowAndNotLock[i], propertyDiv);
    }

    /**
     * Lastly, take the ones that should be locked and make a UI thing and lock them
     */
    const toShowAndLock = properties.filter(function (property) {
      return game.allTimeGold >= (property.eligibility * 0.7) && !property.shown && !property.locked;
    });

    /**
     * If there's none to show, show at least one
     * @param  {[type]} toShowAndLock [description]
     * @return {[type]}               [description]
     */
    if (toShowAndLock.length === 0) {
      const locked = properties.filter(function (property) {
        return property.locked;
      });
      if (locked.length === 0) {
        const shown = properties.filter(function (property) {
          return property.shown;
        });
        if (properties[shown.length] !== undefined) { // to make it not show empty ones at the end
          UI.showAndLockProperty(properties[shown.length], propertyDiv);
        }
      }
    } else {
      for (let i = 0; i < toShowAndLock.length; i++) {
        UI.showAndLockProperty(toShowAndLock[i], propertyDiv);
      }
    }

  }

  /**
   * Shows and locks a property UI element
   * @param  {obj} property
   */
  static showAndLockProperty(property, propertyDiv) {
    const template = document.getElementById('property_template').content;

    template.querySelector('.property-row').setAttribute('data-propid-container', property.id);

    template.querySelector('.property-name').innerHTML = 'Locked';
    template.querySelector('.property-desc').innerHTML = '';

    const btn = template.querySelector('.buy-property-btn');
    btn.setAttribute('data-propid', property.id);

    btn.style.display = 'none';

    const clone = document.importNode(template, true);
    propertyDiv.appendChild(clone);

    property.locked = true;
    property.shown = true;

    UI.updatePropertyCostUI(property);
    UI.updatePropertyCountUI(property);
  }

  /**
   * Shows an unlocked property
   * @param  {obj} property
   * @param  {html} propertyDiv
   */
  static showAndNotLockProperty(property, propertyDiv) {
    const template = document.getElementById('property_template').content;

    template.querySelector('.property-row').setAttribute('data-propid-container', property.id);

    template.querySelector('.property-name').innerHTML = property.name;
    template.querySelector('.property-desc').innerHTML = property.description;

    template.querySelector('.buy-property-btn').setAttribute('data-propid', property.id);

    const clone = document.importNode(template, true);
    propertyDiv.appendChild(clone);

    property.shown = true;

    UI.updatePropertyCostUI(property);
    UI.updatePropertyCountUI(property);
  }

  /**
   * Unlocks a property
   * @param  {obj} property
   * @param  {html} propertyDiv
   */
  static unlockProperty(property, propertyDiv, game) {
    console.log(property);
    const el = document.querySelector("[data-propid-container='" + property.id + "']");
    el.querySelector('.property-name').innerHTML = property.name;
    el.querySelector('.property-desc').innerHTML = property.description;

    const btn = el.querySelector('.buy-property-btn');

    btn.setAttribute('data-propid', property.id);
    btn.addEventListener('click', function () {
      game.buyProperty(parseInt(this.getAttribute('data-propid')));
    });

    btn.style.display = 'inline-block';

    property.locked = false;

    UI.updatePropertyCostUI(property);
    UI.updatePropertyCountUI(property);
  }

}
