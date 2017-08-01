const UpgradeList = require('./UpgradeList');
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
    console.log(this.eligibleUpgrades);
    this.workers = [];

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
      self.gold += self.workValue;
      self.updateUI();
    });


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
  * Gets eligible upgrades and returns them
  */
  getEligibleUpgrades() {
    return this.upgrades.filter(function (upgrade) {
      return upgrade.eligibility >= this.allTimeGold && upgrade.owned === false;
    }.bind(this));
  }

};
