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
		this.gold = 9999999;
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
		this.propertiesDiv = document.getElementById('properties');
		this.workersDiv = document.getElementById('workers');
		this.upgradesDiv = document.getElementById('upgrades');

		/**
		* Button Listeners
		*/
		this.mainBtn.addEventListener('click', function () {
			self.work()
			self.updateUI();
		});

		/**
		 * UI setup
		 */
		Setup.setupPropertyUi(this.properties, this.propertiesDiv);
		Setup.setupWorkerUi(this.workers, this.workersDiv);
		Setup.setupUpgradeUi(this.upgrades, this.upgradesDiv);

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
		this.goldEl.innerHTML = Math.round(this.gold);
		this.workValueEl.innerHTML = this.workValue;
		this.gpsValueEl.innerHTML = Utils.roundNumber(this.goldPerSecond, 2);
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

		/**
		 * Buy property
		 */
		this.gold -= property.cost;
		this.workValue += property.workValue;
		property.count += 1;

		/**
		 * Make sure workers work on these properties
		*/
		const relevantWorkers = this.workers.filter(function (worker) {
			return worker.propId === property.id && worker.hired === true;
		});

		/**
		 * TODO: Update this when workers have speed
		 */
		for (let i = 0; i < relevantWorkers.length; i++) {
			this.goldPerSecond += property.workValue / relevantWorkers[i].secondsToWork;
		}

		property.updateCost();
		UI.updatePropertyCostUI(property);
		UI.updatePropertyCountUI(property);
		this.updateUI();

		return true
	}

	/**
	* Buy worker
	*
	* propid {int} Id of the worker
	* return {bool} true if successfully bought
	*/
	buyWorker(workerid) {
		const worker = this.workers.find(function (worker) {
			return worker.id === workerid;
		});

		const correspondingProperty = this.properties.find(function (property) {
			return property.id === worker.propId;
		});

		/**
		 * TODO: These two errors should be separated in the future for UI reasons
		 */
		if (this.gold < worker.cost || correspondingProperty.count === 0 || worker.hired === true) {
			return false;
		}

		this.gold -= worker.cost;

		/**
		 * TODO: Change this maybe? Maybe not Math.ceil?
		 */
		this.goldPerSecond += (correspondingProperty.count * correspondingProperty.workValue) / worker.secondsToWork;
		worker.hired = true;

		this.updateUI();

		return true;
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

		/**
		 * Corresponding property
		 */
		const property = this.properties.find(function (property) {
			return property.id === upgrade.propId && property.count > 0;
		});

		/**
		 * Requirements for buying
		 */
		if (this.gold < upgrade.cost || property.length === 0 || upgrade.owned === true) {
			return false;
		}

		/**
		 * Corresponding workers
		 * The reason we only assign this here is because we first check above if we are even eligible to purchase thiis
		 */
		const workers = this.workers.filter(function (worker) {
			return worker.propId === property.id;
		});

		/**
		 * Buy it
		 */
		this.gold -= upgrade.cost;
		upgrade.owned = true;

		/**
		 * Update the property
		 */
		property.workValue += upgrade.workValue;
		property.workValue *= upgrade.workValueMultiplier;

		upgrade.owned = true;
		this.updateWorkValue();
		this.updateGoldPerSecond();
		this.updateUI();

		return true;
	}

	/**
	 * Updates work value
	 */
	updateWorkValue() {
		let tmpWorkValue = 0;
		const ownedProperties = this.properties.filter(function (property) {
			return property.count > 0;
		});

		for (let i = 0; i < ownedProperties.length; i++) {
			tmpWorkValue += ownedProperties[i].count * ownedProperties[i].workValue;
		}

	}

	/**
	 * Updates the gold per second
	 */
	updateGoldPerSecond() {
		let tmpGps = 0;
		const ownedProperties = this.properties.filter(function (property) {
			return property.count > 0;
		});

		let workers;

		for (let i = 0; i < ownedProperties.length; i++) {
			workers = this.workers.filter(function (worker) {
				return worker.propId === ownedProperties[i].id;
			});

			console.log(workers);

			for (let j = 0; j < workers.length; j++) {
				tmpGps += (ownedProperties[i].count * ownedProperties[i].workValue) / workers[j].secondsToWork;
			}

		}

		console.log(tmpGps);
		this.goldPerSecond = tmpGps;

	}



	/**
	* Binds buttons
	*/
	bindButtons() {
		const self = this;

		/**
		* Buy properties
		*/
		document.querySelectorAll('.buy-property-btn').forEach(function (button) {
			button.addEventListener('click', function () {
				self.buyProperty(parseInt(this.getAttribute('data-propid')));
			});
		});

		/**
		* Buy workers
		*/
		document.querySelectorAll('.buy-worker-btn').forEach(function (button) {
			button.addEventListener('click', function () {
				self.buyWorker(parseInt(this.getAttribute('data-workerid')));
			});
		});

		/**
		* Buy upgrades
		*/
		document.querySelectorAll('.buy-upgrade-btn').forEach(function (button) {
			button.addEventListener('click', function () {
				self.buyUpgrade(parseInt(this.getAttribute('data-upid')));
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
  * description {string}
  * eligibility {int} How much gold do you need to earn before you are eglibigle to see this upgrade
  * count {int} How many of these are owned (maybe not the best structure for this type of variable)
  */
  constructor(id, name, cost, costMultiplier, workValue, description, eligibility, count) {
    this.id = id;
    this.name = name;
    this.cost = cost;
    this.costMultiplier = costMultiplier;
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
  //new Property(id, name, cost, costMultiplier, workValue, description, eligibility, count)
  new Property(0, 'Farm', 10, 1.05, 1,'Buy more farms to harvest more crops', 0, 1),
  new Property(1, 'General Store', 1000, 1.1, 20,'Buy a general store to earn some gold', 0, 0),
  new Property(2, 'Sword Sharpening Store', 10000, 1.2, 100, 'Sharpen swords for other people in the kingdom!', 0, 0)
];

},{"./Property":2}],4:[function(require,module,exports){
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
  constructor(id, propId, name, cost, workValue, workValueMultiplier, description, eligibility) {
    this.id = id;
    this.propId = propId;
    this.name = name;
    this.cost = cost;
    this.workValue = workValue;
    this.workValueMultiplier = workValueMultiplier;
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
  // new Upgrade(id, propId, name, cost, workValue, workValueMultiplier, description, eligibility)
  new Upgrade(0, 0,'corn', 10, 0, 1.5, 'Learn how to farm corn - add 50% to your farming output', 0)
];

},{"./Upgrade":6}],8:[function(require,module,exports){
/**
* Happy King
* Author: Sam Creamer
*/

module.exports = class Utils {
  /**
   * Rounds number
   */
  static roundNumber(number, decimals) {
    return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }
};

},{}],9:[function(require,module,exports){
/**
* Happy King
* Author: Sam Creamer
*/

module.exports = class Worker {
  /**
  * Id {int}
  * PropId {int} The corresponding property ID. Usually the same as id
  * Name {string}
  * description {string}
  * eligibility {int} How much gold do you need to earn before you are eglibigle to see this upgrade
  * secondsToWork {int} how many seconds does it take for this worker to work
  * hired {bool} Is this worker hired?
  */
  constructor(id, propId, name, cost, description, eligibility, secondsToWork) {
    this.id = id;
    this.propId = propId;
    this.name = name;
    this.cost = cost;
    this.description = description;
    this.eligibility = eligibility;
    this.secondsToWork = secondsToWork;
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
  //new Worker(id, propId, name, cost, description, eligibility)
  new Worker(0, 0, 'Noob Farmer', 10, 'Will work your farms once every 5 seconds', 0, 5),
  new Worker(1, 1, 'Young Store Clerk', 10, 'Will work the stores once every 8 seconds', 0, 8),
  new Worker(2, 2, 'Apprentice Sword Sharpener', 10, 'Runs the sword sharpening shops, once per 8 seconds', 0, 8),
  new Worker(3, 0, 'Student Farmer', 10, 'A student, studying farms. Works once per 2 seconds', 0, 2)
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
