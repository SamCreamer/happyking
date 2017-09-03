/**
* Happy King
* Author: Sam Creamer
*/


const numberformat = require('swarm-numberformat');

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
  static uiWaterfall(game) {

    /**
     * Important vars
     */
    const properties = game.properties;
    const workers = game.workers;

    /**
     * Get the ones that are locked that we need to unlock first
     */
    const toUnlock = properties.filter(function (property) {
      return game.allTimeGold >= property.eligibility && property.locked;
    });

    for (let i = 0; i < toUnlock.length; i++) {
      const relevantWorkers = workers.filter(function (worker) {
        return worker.propId === toUnlock[i].id;
      });

      UI.unlockProperty(toUnlock[i], game);

      /**
       * Also lock workers
       */
      for (let j = 0; j < relevantWorkers.length; j++) {
        UI.unlockWorker(relevantWorkers[j], game);
      }

    }

    /**
     * Next get the eligible properties and make UI elements with them. Only should really get anything here on the first iteration of this method
     * TODO: maybe improve this? This code is kinda unnecessary
     */
    const toShowAndNotLock = properties.filter(function (property) {
      return game.allTimeGold >= property.eligibility && !property.shown && !property.locked;
    });

    for (let i = 0; i < toShowAndNotLock.length; i++) {
      const relevantWorkers = workers.filter(function (worker) {
        return worker.propId === toShowAndNotLock[i].id;
      });

      UI.showAndNotLockProperty(toShowAndNotLock[i]);

      for (let j = 0; j < relevantWorkers.length; j++) {
        UI.showAndNotLockWorker(relevantWorkers[j], game);
      }
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
          const relevantWorkers = workers.filter(function (worker) {
            return worker.propId === properties[shown.length].id;
          });

          UI.showAndLockProperty(properties[shown.length]);

          for (let j = 0; j < relevantWorkers.length; j++) {
            UI.showAndLockWorker(relevantWorkers[j], game);
          }
        }
      }
    } else {
      for (let i = 0; i < toShowAndLock.length; i++) {
        const relevantWorkers = workers.filter(function (worker) {
          return worker.propId === toShowAndLock[i].id;
        });

        UI.showAndLockProperty(toShowAndLock[i]);

        for (let j = 0; j < relevantWorkers.length; j++) {
          UI.showAndLockWorker(relevantWorkers[j], game);
        }
      }
    }

  }

  /**
   * Shows and locks a property UI element
   * @param  {obj} property
   */
  static showAndLockProperty(property) {
    const propertyDiv = document.getElementById('properties');

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
  static showAndNotLockProperty(property) {
    const propertyDiv = document.getElementById('properties');

    const template = document.getElementById('property_template').content;

    template.querySelector('.property-row').setAttribute('data-propid-container', property.id);

    template.querySelector('.property-name').innerHTML = property.name;
    template.querySelector('.property-desc').innerHTML = property.description;

    template.querySelector('.buy-property-btn').setAttribute('data-propid', property.id);

    template.querySelectorAll('.dash').forEach(function (ele) {
      ele.style.display = 'inline';
    });

    const clone = document.importNode(template, true);

    template.querySelectorAll('.dash').forEach(function (ele) {
      ele.style.display = 'none';
    });

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
  static unlockProperty(property, game) {
    const propertyDiv = document.getElementById('properties');

    const el = document.querySelector("[data-propid-container='" + property.id + "']");
    el.querySelector('.property-name').innerHTML = property.name;
    el.querySelector('.property-desc').innerHTML = property.description;

    el.querySelectorAll('.dash').forEach(function (ele) {
      ele.style.display = 'inline';
    });

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

  /**
   * show and lock worker
   * @param  {obj} worker
   */
  static showAndLockWorker(worker) {
    const workerDiv = document.querySelector('#workers');

    const template = document.getElementById('worker_template').content;

    template.querySelector('.worker-row').setAttribute('data-workerid-container', worker.id);

    template.querySelector('.worker-name').innerHTML = 'Locked';
    template.querySelector('.worker-desc').innerHTML = '';

    const btn = template.querySelector('.buy-worker-btn');
    btn.setAttribute('data-workerid', worker.id);

    btn.style.display = 'none';

    const clone = document.importNode(template, true);
    workerDiv.appendChild(clone);

    worker.locked = true;
    worker.shown = true;

  }

  /**
   * showAndNotLockWorker
   * @param  {obj} worker
   */
  static showAndNotLockWorker(worker) {
    const workerDiv = document.querySelector('#workers');

    const template = document.getElementById('worker_template').content;

    template.querySelector('.worker-name').innerHTML = worker.name;
    template.querySelector('.worker-desc').innerHTML = worker.description;
    template.querySelector('.worker-cost').innerHTML = worker.cost;

    const btn = template.querySelector('.buy-worker-btn');

    btn.setAttribute('data-workerid', worker.id);

    const clone = document.importNode(template, true);
    workerDiv.appendChild(clone);

    worker.shown = true;

  }

  /**
   * Unlock worker
   * @param  {obj} worker
   */
  static unlockWorker(worker, game) {
    const el = document.querySelector("[data-workerid-container='" + worker.id + "']");
    el.querySelector('.worker-name').innerHTML = worker.name;
    el.querySelector('.worker-desc').innerHTML = worker.description;

    el.querySelectorAll('.dash').forEach(function (ele) {
      ele.style.display = 'inline';
    });

    const btn = el.querySelector('.buy-worker-btn');

    btn.setAttribute('data-workerid', worker.id);

    btn.addEventListener('click', function () {
      game.buyWorker(parseInt(this.getAttribute('data-workerid')), this);
    });

    btn.style.display = 'inline-block';

    worker.locked = false;
  }

}
