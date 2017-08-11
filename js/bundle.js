(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const UpgradeList = require('./UpgradeList');
const WorkerList = require('./WorkerList');
const PropertyList = require('./PropertyList');
const Setup = require('./Setup');
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
		this.updateUI();

		return true;
	}

	/**
	 * Binds buttons
	 */
	bindButtons() {
		const self = this;
		document.querySelectorAll('.buy-upgrade-btn').forEach(function (button) {
      button.addEventListener('click', function () {
        self.buyUpgrade(parseInt(this.getAttribute('data-upid')));
      });
    });
	}

};

},{"./PropertyList":3,"./Setup":4,"./UpgradeList":6,"./Utils":7,"./WorkerList":9}],2:[function(require,module,exports){
module.exports = class Property {
  /**
  * Id {int}
  * Name {string}
  * Cost {int} How many gold does it cost
  * Cost Multiplier {float}
  * goldPerSecond {int}
  * description {string}
  * eligibility {int} How much gold do you need to earn before you are eglibigle to see this upgrade
  */
  constructor(id, name, cost, costMultiplier, goldPerSecond, workValue, description, eligibility) {
    this.id = id;
    this.name = name;
    this.cost = cost;
    this.costMultiplier = costMultiplier;
    this.goldPerSecond = goldPerSecond;
    this.workValue = workValue;
    this.description = description;
    this.eligibility = eligibility;
  }

  /**
   * Update the cost of this property
   */
  updateCost() {
    const newCost = parseInt(this.cost * this.costMultiplier);
    if (newCost === this.cost) {
      return this.cost + 1;
    } else {
      return newCost;
    }
  }

};

},{}],3:[function(require,module,exports){
const Property = require('./Property');

module.exports = [
  new Property(0, 'Farm', 10, 1.05, 0, 'Buy more farms to harvest more crops', 0)
];

},{"./Property":2}],4:[function(require,module,exports){
module.exports = class Setup {

  /**
   * Takes upgrade object array and makes the UI for them
   */
  static setupUpgradeUi(upgrades, upgradesDiv) {
    // setup upgrade UI
    for (let i = 0; i < upgrades.length; i++) {
      const template = document.getElementById('upgrade_template').content;

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

      template.querySelector('.property-name').innerHTML = properties[i].name;
      template.querySelector('.property-desc').innerHTML = properties[i].description;

      const btn = template.querySelector('.buy-property-btn');
      btn.setAttribute('data-propid', properties[i].id);

      const clone = document.importNode(template, true);
      propertyDiv.appendChild(clone);
    }
  }

}

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
const Upgrade = require('./Upgrade');

module.exports = [
  new Upgrade(0, 'corn', 10, 0, 2, 'Learn how to farm corn', 0)
];

},{"./Upgrade":5}],7:[function(require,module,exports){
module.export = class Utils {

};

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
const Worker = require('./Worker');

module.exports = [
  new Worker(0, 'Farmer', 0, 2, 'Help you farm', 0)
];

},{"./Worker":8}],10:[function(require,module,exports){
const Game = require('./Game');

const game = new Game();

window.setInterval(function () {
  game.gameLoop();
}, 1000);

},{"./Game":1}]},{},[10]);
