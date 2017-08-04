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
  constructor(id, name, cost, goldPerSecond, workValue, description, eligibility) {
    this.id = id;
    this.name = name;
    this.cost = cost;
    this.costMultiplier = costMultiplier;
    this.goldPerSecond = goldPerSecond;
    this.workValue = workValue;
    this.description = description;
    this.eligibility = eligibility;
  }

  updateCost() {

  }

};
