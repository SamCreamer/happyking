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
