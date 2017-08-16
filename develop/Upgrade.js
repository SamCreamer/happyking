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
