(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./UpgradeList":3,"./Utils":4}],2:[function(require,module,exports){
module.exports = class Upgrade {
  /**
  * Id {int}
  * Name {string}
  * goldPerSecond {int}
  * description {string}
  * eligibility {int} How much gold do you need to earn before you are eglibigle to see this upgrade
  */
  constructor(id, name, goldPerSecond, workValue, description, eligibility) {
    this.id = id;
    this.name = name;
    this.goldPerSecond = goldPerSecond;
    this.workValue = workValue;
    this.description = description;
    this.eligibility = eligibility;
    this.owned = false;
  }
};

},{}],3:[function(require,module,exports){
const Upgrade = require('./Upgrade');

module.exports = [
  new Upgrade(0, 'corn', 0, 2, 'Learn how to farm corn', 0)
];

},{"./Upgrade":2}],4:[function(require,module,exports){
module.export = class Utils {

};

},{}],5:[function(require,module,exports){
const Game = require('./Game');

const game = new Game();

window.setInterval(function () {
  game.gameLoop();
}, 1000);

},{"./Game":1}]},{},[5]);
