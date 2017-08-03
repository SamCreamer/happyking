const UpgradeList = require('./UpgradeList');
const WorkerList = require('./WorkerList');
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
    this.goldPerSecond = 0;
    this.upgrades = UpgradeList;
    this.eligibleUpgrades = this.getEligibleUpgrades();
    this.workers = WorkerList;
		this.eligibleWorkers = this.getEligibleWorkers();

    /**
    * UI Elements
    */
    this.goldEl = document.getElementById('gold');
    this.mainBtn = document.getElementById('main_click_btn');
    this.buyUpgradeBtn = document.getElementsByClassName('buy-upgrade-btn');

    /**
    * Button Listeners
    */
    this.mainBtn.addEventListener('click', function () {
      self.work()
      self.updateUI();
    });

		// Create upgrade button events
		for (let i = 0; i < this.buyUpgradeBtn.length; i++) {
			this.buyUpgradeBtn[i].addEventListener('click', function (e) {
				const upgradeId = parseInt(this.getAttribute('data-upid'));
				if (self.buyUpgrade(upgradeId)) {
					this.parentNode.parentNode.parentNode.remove();
				}
			});
		}

	}

  /**
  * Runs once per second
  */
  gameLoop() {
		console.log(this);
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

};
