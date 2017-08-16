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
