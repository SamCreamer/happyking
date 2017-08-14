/**
* Happy King
* Author: Sam Creamer
*/

const UI = require('./Ui');

module.exports = class Setup {

  /**
  * Setup property list ui
  */
  static setupPropertyUi(properties, propertyDiv) {
    for (let i = 0; i < properties.length; i++) {
      const template = document.getElementById('property_template').content;

      template.querySelector('.property-row').setAttribute('data-propid-container', properties[i].id);

      template.querySelector('.property-name').innerHTML = properties[i].name;
      template.querySelector('.property-desc').innerHTML = properties[i].description;

      template.querySelector('.buy-property-btn').setAttribute('data-propid', properties[i].id);

      const clone = document.importNode(template, true);
      propertyDiv.appendChild(clone);

      UI.updatePropertyCostUI(properties[i]);
      UI.updatePropertyCountUI(properties[i]);

    }
  }


  /**
  * Setup worker list ui
  */
  static setupWorkerUi(workers, workerDiv) {
    for (let i = 0; i < workers.length; i++) {
      const template = document.getElementById('worker_template').content;

      template.querySelector('.worker-row').setAttribute('data-workerid-container', workers[i].id);

      template.querySelector('.worker-name').innerHTML = workers[i].name;
      template.querySelector('.worker-desc').innerHTML = workers[i].description;
      template.querySelector('.worker-cost').innerHTML = workers[i].cost;

      template.querySelector('.buy-worker-btn').setAttribute('data-workerid', workers[i].id);

      const clone = document.importNode(template, true);
      workerDiv.appendChild(clone);

    }
  }

  /**
  * Takes upgrade object array and makes the UI for them
  */
  static setupUpgradeUi(upgrades, upgradesDiv) {
    // setup upgrade UI
    for (let i = 0; i < upgrades.length; i++) {
      const template = document.getElementById('upgrade_template').content;

      template.querySelector('.upgrade-row').setAttribute('data-upid-container', upgrades[i].id);

      template.querySelector('.upgrade-name').innerHTML = upgrades[i].name;
      template.querySelector('.upgrade-desc').innerHTML = upgrades[i].description;
      template.querySelector('.upgrade-cost').innerHTML = upgrades[i].cost;

      template.querySelector('.buy-upgrade-btn').setAttribute('data-upid', upgrades[i].id);

      const clone = document.importNode(template, true);
      upgradesDiv.appendChild(clone);
    }

  }


}
