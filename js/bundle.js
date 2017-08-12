(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
* Happy King
* Author: Sam Creamer
*/

const UpgradeList = require('./UpgradeList');
const WorkerList = require('./WorkerList');
const PropertyList = require('./PropertyList');
const Setup = require('./Setup');
const UI = require('./Ui');
const Utils = require('./Utils');

/**
* Main Game class
*/
module.exports = class Game {

	constructor() {
		// Instead of binding this to everything individually
		const self = this;

		/**
		* Game Variables
		*/
		this.gold = 0;
		this.allTimeGold = 0;
		this.workValue = 1;
		this.multiplier = 1;
		this.goldPerSecond = 0;
		this.ownedProperties = {};
		this.hiredWorkers = {};
		this.ownedUpgrades = {};

		/**
		* Global elements
		*/
		this.upgrades = UpgradeList;
		this.eligibleUpgrades = this.getEligibleUpgrades();
		this.workers = WorkerList;
		this.eligibleWorkers = this.getEligibleWorkers();
		this.properties = PropertyList;
		this.eligibleProperties = this.getEligibleProperties();

		/**
		* UI Elements
		*/
		this.goldEl = document.getElementById('gold');
		this.mainBtn = document.getElementById('main_click_btn');
		this.workValueEl = document.getElementById('work_value');
		this.gpsValueEl = document.getElementById('gps_value');
		this.upgradesDiv = document.getElementById('upgrades');
		this.propertiesDiv = document.getElementById('properties');

		// this.buyUpgradeBtn = document.getElementsByClassName('buy-upgrade-btn');

		/**
		* Button Listeners
		*/
		this.mainBtn.addEventListener('click', function () {
			self.work()
			self.updateUI();
		});

		Setup.setupUpgradeUi(this.upgrades, this.upgradesDiv);
		Setup.setupPropertyUi(this.properties, this.propertiesDiv);

		this.bindButtons();

	}

	/**
	* Runs once per second
	*/
	gameLoop() {
		this.gold += this.goldPerSecond;
		this.allTimeGold += this.goldPerSecond;

		this.eligibleUpgrades = this.getEligibleUpgrades();
		this.updateUI();
	}

	/**
	* Updates the UI
	*/
	updateUI() {
		this.goldEl.innerHTML = this.gold;
		this.workValueEl.innerHTML = this.workValue;
		this.gpsValueEl.innerHTML = this.goldPerSecond;
	}

	/**
	* work
	*/
	work() {
		this.gold += this.workValue;
		this.allTimeGold += this.workValue;
	}

	/**
	* Gets eligible upgrades and returns them
	*/
	getEligibleUpgrades() {
		return this.upgrades.filter(function (upgrade) {
			return upgrade.eligibility >= this.allTimeGold && upgrade.owned === false;
		}.bind(this));
	}

	/**
	* Gets eligible workers
	*/
	getEligibleWorkers() {
		return this.workers.filter(function (worker) {
			return worker.eligibility >= this.allTimeGold && worker.hired === false;
		}.bind(this));
	}

	/**
	* Gets eligible properties
	*/
	getEligibleProperties() {
		return this.properties.filter(function (property) {
			return property.eligibility >= this.allTimeGold;
		}.bind(this));
	}

	/**
	* Buy upgrade
	*
	* upid {int} Id of the upgrade
	* return {bool} true if successfully bought
	*/
	buyUpgrade(upid) {
		const upgrade = this.upgrades.find(function (upgrade) {
			return upgrade.id === upid;
		});

		if (this.gold < upgrade.cost) {
			return false;
		}

		this.gold -= upgrade.cost;
		this.workValue += upgrade.workValue;
		this.goldPerSecond += upgrade.goldPerSecond;
		upgrade.owned = true;
		this.updateUI();

		return true;
	}

	/**
	* Buy property
	*
	* propid {int} Id of the property
	* return {bool} true if successfully bought
	*/
	buyProperty(propid) {
		const property = this.properties.find(function (property) {
			return property.id === propid;
		});

		if (this.gold < property.cost) {
			return false;
		}

		this.gold -= property.cost;
		this.workValue += property.workValue;
		this.goldPerSecond += property.goldPerSecond;
		property.count += 1;

		property.updateCost();
		UI.updatePropertyCostUI(property);
		UI.updatePropertyCountUI(property);
		this.updateUI();

		return true;
	}

	/**
	* Binds buttons
	*/
	bindButtons() {
		const self = this;
		/**
		* Buy upgrades
		*/
		document.querySelectorAll('.buy-upgrade-btn').forEach(function (button) {
			button.addEventListener('click', function () {
				self.buyUpgrade(parseInt(this.getAttribute('data-upid')));
			});
		});
		/**
		* Buy properties
		*/
		document.querySelectorAll('.buy-property-btn').forEach(function (button) {
			button.addEventListener('click', function () {
				self.buyProperty(parseInt(this.getAttribute('data-propid')));
			});
		});
	}

};

},{"./PropertyList":3,"./Setup":4,"./Ui":5,"./UpgradeList":7,"./Utils":8,"./WorkerList":10}],2:[function(require,module,exports){
/**
* Happy King
* Author: Sam Creamer
*/

module.exports = class Property {
  /**
  * Id {int}
  * Name {string}
  * Cost {int} How many gold does it cost
  * Cost Multiplier {float}
  * goldPerSecond {int}
  * description {string}
  * eligibility {int} How much gold do you need to earn before you are eglibigle to see this upgrade
  * count {int} How many of these are owned (maybe not the best structure for this type of variable)
  */
  constructor(id, name, cost, costMultiplier, goldPerSecond, workValue, description, eligibility, count) {
    this.id = id;
    this.name = name;
    this.cost = cost;
    this.costMultiplier = costMultiplier;
    this.goldPerSecond = goldPerSecond;
    this.workValue = workValue;
    this.description = description;
    this.eligibility = eligibility;
    this.count = count;
  }

  /**
   * Update the cost of this property
   */
  updateCost() {
    const newCost = parseInt(this.cost * this.costMultiplier);
    if (newCost === this.cost) {
      this.cost++;
    } else {
      this.cost = newCost;
    }
  }

};

},{}],3:[function(require,module,exports){
/**
* Happy King
* Author: Sam Creamer
*/

const Property = require('./Property');

module.exports = [
  //new Property(id, name, cost, costMultiplier, goldPerSecond, workValue, description, eligibility, count)
  new Property(0, 'Farm', 10, 1.05, 0, 1,'Buy more farms to harvest more crops', 0, 1)
];

},{"./Property":2}],4:[function(require,module,exports){
/**
* Happy King
* Author: Sam Creamer
*/

const UI = require('./Ui');

module.exports = class Setup {

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
      template.querySelector('.buy-upgrade-btn').setAttribute('data-upid', upgrades[i].id);

      const clone = document.importNode(template, true);
      upgradesDiv.appendChild(clone);
    }

  }

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

}

},{"./Ui":5}],5:[function(require,module,exports){
/**
* Happy King
* Author: Sam Creamer
*/

/**
* This module is for strictly UI related things
*/
module.exports = class UI {
  /**
  * Updates the property count in the UI
  */
  static updatePropertyCountUI(property) {
    const el = document.querySelector('[data-propid-container="' + property.id + '"]').querySelector('.property-count');
    el.innerHTML = property.count;
  }


  /**
  * Update property cost in the UI
  */
  static updatePropertyCostUI(property) {
    const el = document.querySelector('[data-propid-container="' + property.id + '"]').querySelector('.property-cost');
    el.innerHTML = property.cost;
  }

}

},{}],6:[function(require,module,exports){
/**
* Happy King
* Author: Sam Creamer
*/

module.exports = class Upgrade {
  /**
  * Id {int}
  * Name {string}
  * Cost {int}
  * goldPerSecond {int}
  * description {string}
  * eligibility {int} How much gold do you need to earn before you are eglibigle to see this upgrade
  */
  constructor(id, name, cost, goldPerSecond, workValue, description, eligibility) {
    this.id = id;
    this.name = name;
    this.cost = cost;
    this.goldPerSecond = goldPerSecond;
    this.workValue = workValue;
    this.description = description;
    this.eligibility = eligibility;
    this.owned = false;
  }
};

},{}],7:[function(require,module,exports){
/**
* Happy King
* Author: Sam Creamer
*/

const Upgrade = require('./Upgrade');

module.exports = [
  new Upgrade(0, 'corn', 10, 0, 2, 'Learn how to farm corn', 0)
];

},{"./Upgrade":6}],8:[function(require,module,exports){
/**
* Happy King
* Author: Sam Creamer
*/

module.export = class Utils {

};

},{}],9:[function(require,module,exports){
/**
* Happy King
* Author: Sam Creamer
*/

module.exports = class Worker {
  /**
  * Id {int}
  * Name {string}
  * goldPerSecond {int}
  * description {string}
  * eligibility {int} How much gold do you need to earn before you are eglibigle to see this upgrade
  * hired {bool} Is this worker hired?
  */
  constructor(id, name, goldPerSecond, workValue, description, eligibility) {
    this.id = id;
    this.name = name;
    this.goldPerSecond = goldPerSecond;
    this.workValue = workValue;
    this.description = description;
    this.eligibility = eligibility;
    this.hired = false;
  }
};

},{}],10:[function(require,module,exports){
/**
* Happy King
* Author: Sam Creamer
*/

const Worker = require('./Worker');

module.exports = [
  new Worker(0, 'Farmer', 0, 2, 'Help you farm', 0)
];

},{"./Worker":9}],11:[function(require,module,exports){
/**
* Happy King
* Author: Sam Creamer
*/

const Game = require('./Game');

const game = new Game();

window.setInterval(function () {
  game.gameLoop();
}, 1000);

},{"./Game":1}]},{},[11]);
