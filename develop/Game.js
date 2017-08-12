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
